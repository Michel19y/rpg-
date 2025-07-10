// MusicContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const loadMusic = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/musicas/tema.mp3'),
        { isLooping: true, volume: 1 }
      );
      setSound(sound);
      await sound.playAsync();
    };

    loadMusic();

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  const toggleMusic = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const setMusicVolume = async (v) => {
    if (!sound) return;
    await sound.setVolumeAsync(v);
    setVolume(v);
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, toggleMusic, volume, setMusicVolume }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
