// src/components/Task.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import YouTube from 'react-youtube';
import './Task.css';

const videoList = [
  { id: 'bBBpP8oclPg' },
  { id: 'u7JKBOnO7ts' },
  { id: 'lXKmjEi2cE8' },
  { id: 'E0hdnDJgMyM' },
  { id: 'TyneZm78wVE' }
];

function Task() {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      const todayStr = new Date().toLocaleDateString();
      setToday(todayStr);
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.taskDate !== todayStr) {
          // Reset for new day
          await updateDoc(userDocRef, {
            taskDate: todayStr,
            watchedVideos: [],
          });
          setWatched([]);
        } else {
          setWatched(data.watchedVideos || []);
        }
      } else {
        // Create new user doc
        await setDoc(userDocRef, {
          taskDate: todayStr,
          watchedVideos: [],
          points: 0,
        });
        setWatched([]);
      }

      setLoading(false);
    };

    loadUserData();
  }, [user]);

  const handleVideoEnd = async (videoId) => {
    if (watched.includes(videoId) || !user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data();
      const newWatched = [...(currentData.watchedVideos || []), videoId];
      const newPoints = (currentData.points || 0) + 10;

      await updateDoc(userDocRef, {
        watchedVideos: newWatched,
        points: newPoints,
      });

      setWatched(newWatched);
    }
  };

  if (loading) return <div>Loading your tasks...</div>;

  const remainingVideos = videoList.filter(v => !watched.includes(v.id)).slice(0, 5);

  return (
    <div className="task-container">
      <h2>Watch Videos to Earn Points</h2>
      <p>Watched: {watched.length} / 5</p>

      {watched.length >= 5 ? (
        <p>You've watched all 5 videos today. Come back tomorrow!</p>
      ) : (
        remainingVideos.map(video => (
          <div key={video.id} className="video-box">
            <YouTube
              videoId={video.id}
              opts={{ width: '100%', height: '200' }}
              onEnd={() => handleVideoEnd(video.id)}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Task;