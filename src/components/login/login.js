import React, { useState, useEffect } from 'react';
import {
    doc, getDocs, getDoc, setDoc, updateDoc, addDoc,
    arrayUnion,
    Timestamp,
    collection, query, where } from 'firebase/firestore';
import { db, auth, googleProvider } from '../../config/firebase';
import { signInWithRedirect } from 'firebase/auth';
import './login.css';

export const Login = ({ enterApp, defineUser }) => {
    const [showUserContainer, setShowUserContainer] = useState(true);
    const [showGroupContainer, setShowGroupContainer] = useState(false);

    const [joinGroupActive, setJoinGroupActive] = useState(true);
    const [createGroupActive, setCreateGroupActive] = useState(false);
    const [viewGroupActive, setViewGroupActive] = useState(false);
    const [isGroupChecked, setIsGroupChecked] = useState(true);
    const [signUpActive, setSignUpActive] = useState(true);
    const [loginActive, setLoginActive] = useState(false);
    const [isUserChecked, setIsUserChecked] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupPassword, setGroupPassword] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [groupNames, setGroupNames] = useState([]);

    const toggleGroupCheckbox = () => {
        setIsGroupChecked(!isGroupChecked);
    };

    const joinGroupSelected = () => {
        setJoinGroupActive(true);
        setCreateGroupActive(false);
        setViewGroupActive(false);
    }

    const createGroupSelected = () => {
        setJoinGroupActive(false);
        setCreateGroupActive(true);
        setViewGroupActive(false);
    }

    const viewGroupSelected = () => {
        setJoinGroupActive(false);
        setCreateGroupActive(false);
        setViewGroupActive(true);
    }

    const toggleUserCheckbox = () => {
        setIsUserChecked(!isUserChecked);
    };

    const signUpSelected = () => {
        setSignUpActive(true);
        setLoginActive(false);
    }

    const loginSelected = () => {
        setSignUpActive(false);
        setLoginActive(true);
    }

    const joinGroup = async () => {
        const groupCollectionRef = collection(db, "groups");
        const q = query(groupCollectionRef, where("name", "==", groupName));
        const querySnapshot = await getDocs(q);
        const groupId = querySnapshot.docs[0].id;

        if (querySnapshot.empty) {
            alert("Group doesn't exist!");
        } else {
            if (querySnapshot.data().password == '') {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                await updateDoc(userDocRef, {
                    groups: arrayUnion(groupId),
                });
                await updateDoc(querySnapshot.docs[0], {
                    users: arrayUnion(auth?.currentUser?.uid)
                });
                enterApp(groupName);
            } else {
                if (querySnapshot.data().password == groupPassword) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    await updateDoc(userDocRef, {
                        groups: arrayUnion(groupId),
                    });
                    await updateDoc(querySnapshot.docs[0], {
                        users: arrayUnion(auth?.currentUser?.uid)
                    });
                    enterApp(groupName);
                } else {
                    alert("Password incorrect!");
                }
            }
        }
    }

    const createGroup = async () => {
        const groupCollectionRef = collection(db, "groups");
        const q = query(groupCollectionRef, where("name", "==", groupName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            const groupDocRef = await addDoc(groupCollectionRef, {
                name: groupName,
                hasPassword: !isGroupChecked,
                password: !isGroupChecked ? groupPassword : '',
                creationTime: Timestamp.fromDate(new Date()),
                users: [auth?.currentUser?.uid]
            });
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            await updateDoc(userDocRef, {
                groups: arrayUnion(groupDocRef.id),
            });
        } else {
            alert("Group name already exists!");
        }
    }

    const setUserJson = async () => {
        const userInfoRef = doc(db, "users", auth?.currentUser?.uid);
        try {
            const data = await getDoc(userInfoRef);
            setUserInfo({
                ...data.data()
            });
            defineUser({
                ...data.data()
            });
            const names = await Promise.all(
                data.data().groups.map(async (groupId) => {
                    const groupDoc = await getDoc(doc(db, "groups", groupId));
                    return groupDoc.exists() ? groupDoc.data().name : null;
                })
            );
            setGroupNames(names.filter(name => name !== null));
        } catch (e) {
            console.error(e);
        }
    }

    const login = async () => {
        try {      
            const result = await signInWithRedirect(auth, googleProvider);
            const user = result.user;

            const userDocumentsRef = collection(db, "users");
            const q = query(userDocumentsRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('You must sign up before logging in!');
                return;
            } else {
                // enterApp();
                await setUserJson();
                setShowUserContainer(false);
                setShowGroupContainer(true);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const signUp = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
            const result = await signInWithRedirect(auth, googleProvider);
            const user = result.user;

            const userDocumentsRef = collection(db, "users");
            const q = query(userDocumentsRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                await setDoc(userDocRef, {
                    displayName: displayName,
                    email: auth?.currentUser?.email,
                    groups: [],
                    workouts: [],
                    creationTime: Timestamp.fromDate(new Date())
                });
                // enterApp();
                await setUserJson();
                setShowUserContainer(false);
                setShowGroupContainer(true);
            } else {
                alert('Account already exists...you are being logged in!');
                // enterApp();
                await setUserJson();
                setShowUserContainer(false);
                setShowGroupContainer(true);
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <div className='login-total-container inter-normal'>
                {showUserContainer && 
                <div className='user-container'>
                    <h1 className='input-header'>User</h1>
                    <div className='side-select-container'>
                        <div className={`login-select ${signUpActive ? 'login-select-active' : ''}`}
                             style={{borderRight: "1px solid #eee"}}
                             onClick={signUpSelected}>
                                Sign Up
                        </div>
                        <div className={`login-select ${loginActive ? 'login-select-active' : ''}`}
                             style={{borderLeft: "1px solid #eee"}}
                             onClick={loginSelected}>
                                Login
                        </div>
                    </div>
                    {/*
                    {signUpActive &&
                    <div className='info-message'>
                        A Local User only exists in the group you join, so the data added to your workouts in this group for this user are only shown here.
                    </div>}
                    {loginActive &&
                    <div className='info-message'>
                        A Unique User exists across all groups, so the data added to your workouts in this group for this user are also shown in other groups you join.
                    </div>}
                    */}
                    {signUpActive &&
                    <input className='login-input' 
                           placeholder='Display Name'
                           onChange={(e) => setDisplayName(e.target.value)} />
                    }
                    {/*x
                    <input className='login-input' 
                           placeholder='Password' 
                           type='password'
                           style={{cursor: isUserChecked ? 'not-allowed' : 'default'}} 
                           disabled={isUserChecked} />
                    <div className='login-input-checkbox'>
                        <input type='checkbox' 
                               onClick={toggleUserCheckbox} 
                               checked={isUserChecked} />
                        <div className='checkbox-message'>No Password</div>
                    </div>
                    */}
                    {/*
                    isUserChecked &&
                    <div className='info-message'>
                        * Selecting No Password means that anyone in your groups can edit your workout data.
                    </div>
                    */}
                    {signUpActive && <div className='login-button' onClick={signUp}>Sign Up</div>}
                    {loginActive && <div className='login-button' onClick={login}>Login</div>}
                </div>}

                {showGroupContainer &&
                <div className='group-container'>
                    <h1 className='input-header'>Group</h1>
                    <div className='side-select-container'>
                        <div className={`login-select ${joinGroupActive ? 'login-select-active' : ''}`}
                             style={{borderRight: "1px solid #eee"}}
                             onClick={joinGroupSelected}>
                                Join
                        </div>
                        <div className={`login-select ${createGroupActive ? 'login-select-active' : ''}`}
                             style={{borderLeft: "1px solid #eee"}}
                             onClick={createGroupSelected}>
                                Create
                        </div>
                        <div className={`login-select ${viewGroupActive ? 'login-select-active' : ''}`}
                             style={{borderLeft: "1px solid #eee"}}
                             onClick={viewGroupSelected}>
                                View
                        </div>
                    </div>
                    {(joinGroupActive || createGroupActive) &&
                    <>
                        <input className='login-input' 
                            placeholder='Group Name'
                            onChange={(e) => setGroupName(e.target.value)}  />
                        <input className='login-input' 
                            placeholder='Password' 
                            type='password'
                            onChange={(e) => setGroupPassword(e.target.value)} 
                            style={{cursor: isGroupChecked ? 'not-allowed' : 'default'}} 
                            disabled={isGroupChecked} />
                        <div className='login-input-checkbox'>
                            <input type='checkbox' 
                                onClick={toggleGroupCheckbox} 
                                checked={isGroupChecked} />
                            <div className='checkbox-message'>No Password</div>
                        </div>
                    </>
                    }
                    {viewGroupActive && 
                    <div>
                        {userInfo.groups.length == 0 ? (
                            <span style={{fontSize: '14px'}}>Join groups to view them here!</span>
                        ) : (
                            groupNames.map((name, index) => (
                                <div key={index} className='login-button' onClick={() => enterApp(name)}>
                                    {name}
                                </div>
                            ))
                        )}
                        {/* <div className='login-button' onClick={joinGroup}>HHS</div> */}
                    </div>
                    }
                    {isGroupChecked && createGroupActive &&
                    <div className='info-message'>
                        * Selecting No Password means that your group will be publicly available for anyone to join.
                    </div>}
                    {joinGroupActive && <div className='login-button' onClick={joinGroup}>Join</div>}
                    {createGroupActive && <div className='login-button' onClick={createGroup}>Create</div>}
                </div>}
            </div>
        </>
    );
};