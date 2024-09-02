import React, { useState, useEffect } from 'react';
import {
    doc, getDocs, getDoc, setDoc, updateDoc, addDoc,
    arrayUnion,
    Timestamp,
    collection, query, where } from 'firebase/firestore';
import { db, auth, googleProvider } from './config/firebase';
import './App.css';
import { Landing } from './components/landing/landing.js';
import { Login } from './components/login/login.js';
import { Home } from './components/home/home.js';


function App() {
	const colorArray = ["red", "orange", "green", "dodgerblue", "pink", "darkviolet", "gray", "maroon", "springgreen", "indigo", "fuchsia", "aqua"];
	const shuffledColors = shuffleArray([...colorArray]);
	const [showLanding, setShowLanding] = useState(true);
	const [showLogin, setShowLogin] = useState(false);
	const [showHome, setShowHome] = useState(false);
	const [user, setUser] = useState({});
	const [group, setGroup] = useState({});
	const [groupName, setGroupName] = useState('');

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	const enterLanding = () => {
		setShowLanding(false);
		setShowLogin(true);
	}

	const enterApp = async (groupName) => {
		setShowLogin(false);
		setShowHome(true);
		setGroupName(groupName);
		
		const groupCollectionRef = collection(db, "groups");
		const q = query(groupCollectionRef, where("name", "==", groupName));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			var buildingGroup = {
				...querySnapshot.docs[0].data(),
				colors: shuffledColors
			};
			const usersWithDetails = await Promise.all(
				buildingGroup.users.map(async (userId) => {
					const userInfoRef = doc(db, "users", userId);
					const userDoc = await getDoc(userInfoRef);
		
					if (userDoc.exists()) {
						return {
							id: userId,
							...userDoc.data()
						};
					} else {
						console.log(`No such user: ${userId}`);
						return null;
					}
				})
			);
			buildingGroup.users = usersWithDetails.filter(user => user !== null);
			setGroup(buildingGroup);
		} else { 
			console.log("No matching document found.");
		}
	}

	const updateData = async () => {
		// Update group data
		const groupCollectionRef = collection(db, "groups");
		const q = query(groupCollectionRef, where("name", "==", groupName));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			var buildingGroup = {
				...querySnapshot.docs[0].data(),
				colors: shuffledColors
			};
			const usersWithDetails = await Promise.all(
				buildingGroup.users.map(async (userId) => {
					const userInfoRef = doc(db, "users", userId);
					const userDoc = await getDoc(userInfoRef);
		
					if (userDoc.exists()) {
						return {
							id: userId,
							...userDoc.data()
						};
					} else {
						console.log(`No such user: ${userId}`);
						return null;
					}
				})
			);
			buildingGroup.users = usersWithDetails.filter(user => user !== null);
			setGroup(buildingGroup);
		} else { 
			console.log("No matching group document found.");
		}

		// Update user data
		const userInfoRef = doc(db, "users", auth?.currentUser?.uid);
        try {
            const data = await getDoc(userInfoRef);
            setUser({
                ...data.data()
            });
        } catch (e) {
            console.log("No matching user document found.");
        }
	}

	return (
		<>
			{showLanding && <Landing enterLanding={enterLanding}/>}
			{showLogin && <Login enterApp={enterApp} defineUser={setUser}/>}
			{showHome && <Home group={group} user={user} updateData={updateData}/>}
		</>
	);
}

export default App;
