// Sound Manager - Handles all game audio
// Replace placeholder paths with actual audio files

class SoundManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.currentMusic = null;

        // Define all sound effects
        this.soundDefinitions = {
            // UI Sounds
            'ui-hover': '/assets/audio/sfx/ui-hover.wav',
            'ui-click': '/assets/audio/sfx/ui-click.wav',

            // Token Sounds
            'token-pickup': '/assets/audio/sfx/token-pickup.wav',
            'token-drop': '/assets/audio/sfx/token-drop.wav',

            // Game Events
            'breakthrough': '/assets/audio/sfx/breakthrough.wav',
            'error': '/assets/audio/sfx/error.wav',
            'scribble': '/assets/audio/sfx/scribble.wav',
            'focus-enter': '/assets/audio/sfx/focus-enter.wav',
            'focus-exit': '/assets/audio/sfx/focus-exit.wav',

            // Music/Ambience
            'office-ambience': '/assets/audio/music/office-ambience.mp3',
            'tension': '/assets/audio/music/tension.mp3',
        };
    }

    // Preload all sounds
    async preloadAll() {
        const promises = Object.entries(this.soundDefinitions).map(([key, path]) => {
            return this.loadSound(key, path);
        });

        try {
            await Promise.all(promises);
            console.log('All sounds loaded');
        } catch (err) {
            console.warn('Some sounds failed to load:', err);
        }
    }

    // Load a single sound
    loadSound(key, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = path;
            audio.preload = 'auto';

            audio.addEventListener('canplaythrough', () => {
                this.sounds[key] = audio;
                resolve();
            }, { once: true });

            audio.addEventListener('error', () => {
                console.warn(`Failed to load sound: ${key}`);
                resolve(); // Don't reject, just warn
            }, { once: true });
        });
    }

    // Play a sound effect
    play(key, options = {}) {
        const sound = this.sounds[key];
        if (!sound) {
            console.warn(`Sound not found: ${key}`);
            return null;
        }

        // Clone the audio for overlapping plays
        const audio = sound.cloneNode();
        audio.volume = (options.volume || 1) * this.sfxVolume;

        if (options.loop) {
            audio.loop = true;
        }

        audio.play().catch(err => {
            // Browser may block autoplay
            console.warn('Audio play failed:', err);
        });

        return audio;
    }

    // Play background music
    playMusic(key, options = {}) {
        // Stop current music
        this.stopMusic();

        const sound = this.sounds[key];
        if (!sound) {
            console.warn(`Music not found: ${key}`);
            return;
        }

        this.currentMusic = sound.cloneNode();
        this.currentMusic.volume = (options.volume || 1) * this.musicVolume;
        this.currentMusic.loop = options.loop !== false;

        this.currentMusic.play().catch(err => {
            console.warn('Music play failed:', err);
        });
    }

    // Stop background music
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    // Set volume levels
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // Mute/unmute all audio
    mute() {
        this.previousMusicVolume = this.musicVolume;
        this.previousSfxVolume = this.sfxVolume;
        this.setMusicVolume(0);
        this.setSfxVolume(0);
    }

    unmute() {
        this.setMusicVolume(this.previousMusicVolume || 0.5);
        this.setSfxVolume(this.previousSfxVolume || 0.7);
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
export default soundManager;
