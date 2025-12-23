document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const queueList = document.getElementById('queue-list');
    const logoutBtn = document.getElementById('logout-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const playlistBtn = document.getElementById('playlist-btn');
    
    // Music library 
    const songs = [
        { title: "NOT CUTE ANYMORE", artist: "ILLIT", src: "../songs/ILLIT-NOT CUTE ANYMORE.mp3", cover: "../songs/illit-not-cute-anymore.webp", duration: "2:12" },
        { title: "Focus", artist: "Hearts2Hearts", src: "../songs/H2H_FOCUS.mp3", cover: "../songs/H2H-Focus.webp", duration: "2:57" },
        { title: "Heart Surf", artist: "Kep1er", src: "../songs/kep1er-heart-surf.mp3", cover: "../songs/kep1er-tipitap.webp", duration: "2:53" },
        { title: "Biii:-P", artist: "XLOV", src: "../songs/XLOV Biii -P.mp3", cover: "../songs/xlov-unlove.webp", duration: "2:15" },
        { title: "BLUE", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-BLUE.mp3", cover: "../songs/zerobaseone-blueparadise.webp", duration: "3:02" },
        { title: "Out of Love", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-Out of Love.mp3", cover: "../songs/zerobaseone-blueparadise.webp", duration: "2:35" },
        { title: "Step Back", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-Step Back.mp3", cover: "../songs/zerobaseone-blueparadise.webp", duration: "2:51" },
        { title: "Cruel", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-Cruel.mp3", cover: "../songs/zerobaseone-blueparadise.webp", duration: "2:57" },
        { title: "Insomnia", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-Insomnia.mp3", cover: "../songs/ZEROBASEONE-cinema paradise.jpg", duration: "2:43" },
        { title: "GOOD SO BAD", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-GOOD SO BAD.mp3", cover: "../songs/zerobaseone-cinema paradise.jpg", duration: "2:58" },
        { title: "EXTRA", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-EXTRA.mp3", cover: "../songs/ZEROBASEONE-NEVER SAY NEVER.jpg", duration: "2:55" },
        { title: "Long Way Back", artist: "ZEROBASEONE", src: "../songs/ZEROBASEONE-Long Way Back.mp3", cover: "../songs/ZEROBASEONE-NEVER SAY NEVER.jpg", duration: "3:16" },
        { title: "Love War", artist: "YENA, BE'O", src: "../songs/Yena, BE'O-Love War.mp3", cover: "../songs/Yena-Love-War.jpg", duration: "3:08" },
        { title: "Dancing Alone", artist: "KiiiKiii", src: "../songs/KiiiKiii-Dancing Alone.mp3", cover: "../songs/KiiiKiii-Dancing Alone.jpg", duration: "3:18" },
        { title: "Outside", artist: "ENHYPEN", src: "../songs/ENHYPEN - Outside.mp3", cover: "../songs/enhypen-outside.webp", duration: "2:01" },
        { title: "Steroetype", artist: "STAYC", src: "../songs/STAYC-STEREOTYPE.mp3", cover: "../songs/stayc-stereotype.jpg", duration: "3:11" },
        { title: "Last Festival", artist: "TWS", src: "../songs/TWS-Last Festival.mp3", cover: "../songs/tws-last festival.webp", duration: "3:11" },
        { title: "All My Poetry", artist: "CLOSE YOUR EYES", src: "../songs/CYE-All My Poetry.mp3", cover: "../songs/CYE- All my poetry.jpg", duration: "3:35" },
        { title: "Hypnosis", artist: "IVE", src: "../songs/IVE-Hypnosis.mp3", cover: "../songs/Ive-hypnosis.png", duration: "2:26" },
        { title: "Light A Flame", artist: "SEVENTEEN", src: "../songs/seventeen light a flame.mp3", cover: "../songs/seventeen light a flame.png", duration: "3:09" },
    ];
    
    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalQueue = [...songs];
    let shuffledQueue = [...songs].sort(() => Math.random() - 0.5);
    // Session played list for Up Next behavior (accumulate played songs at bottom)
    let playedQueue = [];
    
    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderQueue();
        updatePlayerState();
    }
    
    // Load song
    function loadSong(index) {
        const song = isShuffled ? shuffledQueue[index] : originalQueue[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.cover;
        audioPlayer.src = song.src;
        durationEl.textContent = song.duration;
        
        // Add active class to current song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach(item => item.classList.remove('active'));
        if (queueItems[index]) {
            queueItems[index].classList.add('active');
        }
        
        // Update favorite button
        updateFavoriteButton();
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
        document.querySelector('.player-container').classList.add('playing');
        updatePlayerState();
        addToRecent();

        // Track played songs for Up Next list: push current song id when it starts playing
        const activeQueue = isShuffled ? shuffledQueue : originalQueue;
        const current = activeQueue[currentSongIndex];
        if (current) {
            const id = current.title + '|' + current.artist;
            if (playedQueue.length === 0 || playedQueue[playedQueue.length - 1] !== id) {
                playedQueue.push(id);
                // limit growth
                if (playedQueue.length > 100) playedQueue.shift();
            }
        }
        renderQueue();
    }
    
    // Add current song to recent
    function addToRecent() {
        const queue = isShuffled ? shuffledQueue : originalQueue;
        const song = queue[currentSongIndex];
        const recent = JSON.parse(localStorage.getItem('pop_recent') || '[]');
        
        // Remove if already exists to add to top
        const idx = recent.findIndex(s => s.title === song.title && s.artist === song.artist);
        if (idx > -1) recent.splice(idx, 1);
        
        // Add to beginning and limit to 50 items
        recent.unshift({...song});
        recent.splice(50);
        
        localStorage.setItem('pop_recent', JSON.stringify(recent));
        renderRecent();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
        document.querySelector('.player-container').classList.remove('playing');
        updatePlayerState();
    }
    
    // Previous song
    function prevSong() {
        const queue = isShuffled ? shuffledQueue : originalQueue;
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = queue.length - 1;
        }
        loadSong(currentSongIndex);
        // Always attempt to play when user pressed prev
        playSong();
    }
    
    // Next song
    function nextSong() {
        // If repeat is enabled, replay the current song
        if (isRepeated) {
            audioPlayer.currentTime = 0;
            playSong();
            return;
        }
        
        const queue = isShuffled ? shuffledQueue : originalQueue;
        currentSongIndex++;
        if (currentSongIndex >= queue.length) {
            currentSongIndex = queue.length - 1;
            pauseSong();
            return;
        }
        loadSong(currentSongIndex);
        // Always attempt to play when user pressed next or when programmatically moving
        playSong();
    }
    
    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        
        // Format time
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };
        
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume() {
        audioPlayer.volume = this.value;
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        if (isShuffled) {
            // Create randomized queue while keeping current song first
            const currentSong = originalQueue[currentSongIndex];
            const others = originalQueue.filter(s => !(s.title === currentSong.title && s.artist === currentSong.artist));
            shuffledQueue = [currentSong, ...others.sort(() => Math.random() - 0.5)];
            currentSongIndex = 0;
        } else {
            // Switch back to original queue
            const currentSong = shuffledQueue[currentSongIndex];
            currentSongIndex = originalQueue.findIndex(song => song.title === currentSong.title && song.artist === currentSong.artist);
        }
        
        renderQueue();
        updatePlayerState();
    }
    
    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('active', isRepeated);
        updatePlayerState();
    }
    
    // Render queue
    function renderQueue() {
        queueList.innerHTML = '';
        const queue = isShuffled ? shuffledQueue : originalQueue;

        // Render upcoming songs (after current index)
        for (let i = currentSongIndex + 1; i < queue.length; i++) {
            const song = queue[i];
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            queueItem.innerHTML = `
                <div class="queue-item-img">
                    <img src="${song.cover}" alt="${song.title}">
                </div>
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="queue-item-duration">${song.duration}</div>
            `;
            queueItem.addEventListener('click', () => {
                currentSongIndex = i;
                loadSong(currentSongIndex);
                if (isPlaying) playSong();
            });
            queueList.appendChild(queueItem);
        }

        // Append the playedQueue (played songs accumulate at the bottom)
        playedQueue.forEach(id => {
            const [title, artist] = id.split('|');
            const song = queue.find(s => s.title === title && s.artist === artist) || songs.find(s => s.title === title && s.artist === artist);
            if (!song) return;
            const idx = queue.findIndex(s => s.title === song.title && s.artist === song.artist);
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item played';
            queueItem.innerHTML = `
                <div class="queue-item-img">
                    <img src="${song.cover}" alt="${song.title}">
                </div>
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="queue-item-duration">${song.duration}</div>
            `;
            queueItem.addEventListener('click', () => {
                if (idx > -1) {
                    currentSongIndex = idx;
                    loadSong(currentSongIndex);
                    if (isPlaying) playSong();
                } else {
                    // fallback: play by matching in songs
                    const fallbackIdx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                    if (fallbackIdx > -1) {
                        currentSongIndex = fallbackIdx;
                        loadSong(currentSongIndex);
                        if (isPlaying) playSong();
                    }
                }
            });
            queueList.appendChild(queueItem);
        });
    }
    
    // Update player state (for UI feedback)
    function updatePlayerState() {
        // Update active song in queue
        const queueItems = document.querySelectorAll('.queue-item');
        queueItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSongIndex);
        });
        
        // Update button states
        shuffleBtn.classList.toggle('active', isShuffled);
        repeatBtn.classList.toggle('active', isRepeated);
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('pop_current');
            window.location.href = '../landing page/page.html';
        });
    }
    
    // Favorite button handler
    function updateFavoriteButton() {
        if (!favoriteBtn) return;
        const song = (isShuffled ? shuffledQueue : originalQueue)[currentSongIndex];
        const favorites = JSON.parse(localStorage.getItem('pop_favorites') || '[]');
        const isFavorite = favorites.some(f => f.title === song.title && f.artist === song.artist);
        favoriteBtn.classList.toggle('active', isFavorite);
        favoriteBtn.innerHTML = isFavorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            const song = (isShuffled ? shuffledQueue : originalQueue)[currentSongIndex];
            const favorites = JSON.parse(localStorage.getItem('pop_favorites') || '[]');
            const idx = favorites.findIndex(f => f.title === song.title && f.artist === song.artist);
            if (idx > -1) {
                favorites.splice(idx, 1);
            } else {
                favorites.push({...song});
            }
            localStorage.setItem('pop_favorites', JSON.stringify(favorites));
            updateFavoriteButton();
            renderFavorites();
        });
    }
    
    // Playlist modal handler
    if (playlistBtn) {
        playlistBtn.addEventListener('click', () => {
            showPlaylistModal();
        });
    }
    
    function showPlaylistModal() {
        const song = (isShuffled ? shuffledQueue : originalQueue)[currentSongIndex];
        const playlists = JSON.parse(localStorage.getItem('pop_playlists') || '{}');
        
        const options = Object.keys(playlists).map(name => `<button data-playlist="${name}">${name}</button>`).join('');
        const modal = document.createElement('div');
        modal.className = 'playlist-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add to Playlist</h3>
                <div class="playlist-options">${options}</div>
                <div class="modal-input">
                    <input type="text" id="new-playlist" placeholder="New playlist name">
                    <button id="create-new">Create</button>
                </div>
                <button class="close-modal">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.querySelectorAll('[data-playlist]').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.playlist;
                playlists[name] = playlists[name] || [];
                const exists = playlists[name].some(s => s.title === song.title && s.artist === song.artist);
                if (!exists) {
                    playlists[name].push({...song});
                    localStorage.setItem('pop_playlists', JSON.stringify(playlists));
                    renderPlaylists();
                    renderSidebarPlaylists();
                }
                modal.remove();
            });
        });
        
        const createBtn = modal.querySelector('#create-new');
        const input = modal.querySelector('#new-playlist');
        if (createBtn && input) {
            createBtn.addEventListener('click', () => {
                const name = input.value.trim();
                if (name && !playlists[name]) {
                    playlists[name] = [{...song}];
                    localStorage.setItem('pop_playlists', JSON.stringify(playlists));
                    renderPlaylists();
                    renderSidebarPlaylists();
                    modal.remove();
                }
            });
        }
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowLeft':
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
                break;
            case 'ArrowRight':
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
                setVolume.call(volumeSlider);
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
                setVolume.call(volumeSlider);
                break;
        }
    });
    
    // Initialize the player
    initFolders();
    initPlayer();
    
    // Tab switching logic
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    function showSection(sectionId) {
        contentSections.forEach(section => section.classList.remove('active'));
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active');
    }
    
    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            // Map menu items to sections
            const sections = ['home-section', 'discover-section', 'favorites-section', 'recent-section', 'playlists-section'];
            showSection(sections[index]);
        });
    });
    
    // Dynamically render sidebar playlists from localStorage
    function renderSidebarPlaylists() {
        const playlistList = document.getElementById('sidebar-playlist-list');
        if (!playlistList) return;
        
        playlistList.innerHTML = '';
        const playlists = JSON.parse(localStorage.getItem('pop_playlists') || '{}');
        
        Object.keys(playlists).forEach(name => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <i class="fas fa-list"></i>
                <span>${name}</span>
            `;
            item.addEventListener('click', () => {
                menuItems.forEach(m => m.classList.remove('active'));
                const playlistsMenu = menuItems[4];
                if (playlistsMenu) playlistsMenu.classList.add('active');
                showSection('playlists-section');
            });
            playlistList.appendChild(item);
        });
    }
    
    // Make sidebar playlist items clickable to navigate to playlists section
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(m => m.classList.remove('active'));
            const playlistsMenu = menuItems[4]; // Playlists is index 4
            if (playlistsMenu) playlistsMenu.classList.add('active');
            showSection('playlists-section');
        });
    });
    
    // Initialize folder system for Discover
    function initFolders() {
        const existingFolders = JSON.parse(localStorage.getItem('pop_discover_folders') || '{}');
        if (Object.keys(existingFolders).length === 0) {
            // Create default folders
            const defaultFolders = {
                'All Songs': songs.map(s => s.title + '|' + s.artist),
                'New Releases': songs.slice(0, 5).map(s => s.title + '|' + s.artist),
                'Top Picks': songs.slice(5, 10).map(s => s.title + '|' + s.artist)
            };
            localStorage.setItem('pop_discover_folders', JSON.stringify(defaultFolders));
            return defaultFolders;
        }
        return existingFolders;
    }
    
    // Render functions
    function renderDiscover() {
        const container = document.getElementById('discover-list');
        if (!container) return;
        container.innerHTML = '';
        
        const folders = JSON.parse(localStorage.getItem('pop_discover_folders') || '{}');
        
        Object.keys(folders).forEach((folderName) => {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'folder-container';
            
            // Folder header with controls
            const folderHeader = document.createElement('div');
            folderHeader.className = 'folder-header';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'folder-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            toggleBtn.title = 'Expand/Collapse';
            
            const nameInput = document.createElement('h3');
            nameInput.className = 'folder-name';
            nameInput.contentEditable = true;
            nameInput.dataset.original = folderName;
            nameInput.textContent = folderName;
            
            const controls = document.createElement('div');
            controls.className = 'folder-controls';
            controls.innerHTML = `
                <button class="folder-btn add-songs-btn" title="Add songs to folder">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="folder-btn add-all-btn" title="Add all songs to folder">
                    <i class="fas fa-plus-square"></i>
                </button>
                <button class="folder-btn delete-folder-btn" title="Delete Folder">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            folderHeader.appendChild(toggleBtn);
            folderHeader.appendChild(nameInput);
            folderHeader.appendChild(controls);
            
            // Make folder name editable
            nameInput.addEventListener('blur', () => {
                const newName = nameInput.textContent.trim();
                const oldName = nameInput.dataset.original;
                if (newName && newName !== oldName && !folders[newName]) {
                    folders[newName] = folders[oldName];
                    delete folders[oldName];
                    localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                    renderDiscover();
                }
                nameInput.textContent = nameInput.dataset.original;
            });
            
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    nameInput.blur();
                }
            });
            
            // Delete folder button
            const deleteBtn = controls.querySelector('.delete-folder-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete folder "${folderName}"? Songs will not be removed.`)) {
                    delete folders[folderName];
                    localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                    renderDiscover();
                }
            });
            
            // Add songs button
            const addSongsBtn = controls.querySelector('.add-songs-btn');
            addSongsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showAddSongsModal(folderName, folders);
            });

            // Add all songs button
            const addAllBtn = controls.querySelector('.add-all-btn');
            addAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const existing = new Set(folders[folderName] || []);
                const toAdd = [];
                songs.forEach(s => {
                    const id = s.title + '|' + s.artist;
                    if (!existing.has(id)) toAdd.push(id);
                });
                if (toAdd.length === 0) {
                    alert('All songs are already in this folder.');
                    return;
                }
                folders[folderName] = (folders[folderName] || []).concat(toAdd);
                localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                renderDiscover();
            });
            
            folderDiv.appendChild(folderHeader);
            
            // Folder content grid (initially visible)
            const grid = document.createElement('div');
            grid.className = 'song-grid folder-grid';
            grid.style.display = 'grid';
            
            const songIds = folders[folderName] || [];
            if (songIds.length === 0) {
                const empty = document.createElement('p');
                empty.style.color = 'var(--text-color)';
                empty.textContent = 'No songs in this folder';
                grid.appendChild(empty);
            } else {
                songIds.forEach((songId) => {
                    const [title, artist] = songId.split('|');
                    const song = songs.find(s => s.title === title && s.artist === artist);
                    if (!song) return;
                    
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'song-card-wrapper';
                    
                    const card = document.createElement('div');
                    card.className = 'song-card';
                    card.innerHTML = `
                        <img src="${song.cover}" alt="${song.title}" onerror="this.src='https://source.unsplash.com/random/150x150/?music'">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    `;
                    card.addEventListener('click', () => {
                        const idx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                        if (idx > -1) {
                            currentSongIndex = idx;
                            loadSong(currentSongIndex);
                            playSong();
                        }
                    });
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-song-btn';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.title = 'Remove from folder';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const idx = folders[folderName].indexOf(songId);
                        if (idx > -1) {
                            folders[folderName].splice(idx, 1);
                            localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                            renderDiscover();
                        }
                    });
                    
                    cardWrapper.appendChild(card);
                    cardWrapper.appendChild(removeBtn);
                    grid.appendChild(cardWrapper);
                });
            }
            
            folderDiv.appendChild(grid);
            
            // Toggle folder expansion
            toggleBtn.addEventListener('click', () => {
                const isVisible = grid.style.display === 'grid';
                grid.style.display = isVisible ? 'none' : 'grid';
                toggleBtn.classList.toggle('expanded', !isVisible);
            });
            
            container.appendChild(folderDiv);
        });
        
        // Add new folder button
        const addFolderBtn = document.createElement('button');
        addFolderBtn.className = 'add-folder-btn';
        addFolderBtn.innerHTML = '<i class="fas fa-folder-plus"></i> New Folder';
        addFolderBtn.addEventListener('click', () => {
            const newFolderName = prompt('Enter folder name:');
            if (newFolderName && newFolderName.trim() && !folders[newFolderName.trim()]) {
                folders[newFolderName.trim()] = [];
                localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                renderDiscover();
            }
        });
        container.appendChild(addFolderBtn);
    }
    
    // Show modal to add songs to a folder
    function showAddSongsModal(folderName, folders) {
        const currentSongIds = new Set(folders[folderName] || []);
        const availableSongs = songs.filter(s => !currentSongIds.has(s.title + '|' + s.artist));
        
        const modal = document.createElement('div');
        modal.className = 'add-songs-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Add Songs to "${folderName}"</h3>
                <div class="modal-search">
                    <input type="text" id="song-search" placeholder="Search songs...">
                </div>
                <div class="modal-songs" id="modal-songs"></div>
                <button class="close-modal">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        const songsContainer = modal.querySelector('#modal-songs');
        const searchInput = modal.querySelector('#song-search');
        
        function renderSongs(filter = '') {
            songsContainer.innerHTML = '';
            const filtered = availableSongs.filter(s => 
                s.title.toLowerCase().includes(filter.toLowerCase()) ||
                s.artist.toLowerCase().includes(filter.toLowerCase())
            );
            
            if (filtered.length === 0) {
                songsContainer.innerHTML = '<p style="color: var(--text-color); text-align: center; padding: 20px;">No songs available</p>';
                return;
            }
            
            filtered.forEach(song => {
                const item = document.createElement('div');
                item.className = 'modal-song-item';
                item.innerHTML = `
                    <div class="modal-song-info">
                        <img src="${song.cover}" alt="${song.title}" onerror="this.src='https://source.unsplash.com/random/100x100/?music'" style="width: 50px; height: 50px; border-radius: 4px; margin-right: 10px;">
                        <div>
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                    <button class="add-btn">Add</button>
                `;
                
                item.querySelector('.add-btn').addEventListener('click', () => {
                    folders[folderName].push(song.title + '|' + song.artist);
                    localStorage.setItem('pop_discover_folders', JSON.stringify(folders));
                    availableSongs.splice(availableSongs.indexOf(song), 1);
                    renderSongs(searchInput.value);
                });
                
                songsContainer.appendChild(item);
            });
        }
        
        searchInput.addEventListener('input', (e) => {
            renderSongs(e.target.value);
        });
        
        renderSongs();
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
            renderDiscover();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                renderDiscover();
            }
        });
    }
    
    function renderFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) return;
        const favorites = JSON.parse(localStorage.getItem('pop_favorites') || '[]');
        container.innerHTML = '';
        if (favorites.length === 0) {
            container.innerHTML = '<p style="color: var(--text-color);">No favorites yet.</p>';
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'song-grid';
        favorites.forEach((song) => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" onerror="this.src='https://source.unsplash.com/random/150x150/?music'">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            `;
            card.addEventListener('click', () => {
                const idx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                if (idx > -1) {
                    currentSongIndex = idx;
                    loadSong(currentSongIndex);
                    playSong();
                }
            });
            grid.appendChild(card);
        });
        container.appendChild(grid);
    }
    
    function renderRecent() {
        const container = document.getElementById('recent-list');
        if (!container) return;
        const recent = JSON.parse(localStorage.getItem('pop_recent') || '[]');
        container.innerHTML = '';
        if (recent.length === 0) {
            container.innerHTML = '<p style="color: var(--text-color);">No recently played songs.</p>';
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'song-grid';
        recent.forEach((song, idx) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'song-card-wrapper';
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" onerror="this.src='https://source.unsplash.com/random/150x150/?music'">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            `;
            card.addEventListener('click', () => {
                const songIdx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                if (songIdx > -1) {
                    currentSongIndex = songIdx;
                    loadSong(currentSongIndex);
                    playSong();
                }
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-song-btn';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.title = 'Remove from recently played';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                recent.splice(idx, 1);
                localStorage.setItem('pop_recent', JSON.stringify(recent));
                renderRecent();
            });
            
            cardWrapper.appendChild(card);
            cardWrapper.appendChild(removeBtn);
            grid.appendChild(cardWrapper);
        });
        container.appendChild(grid);
    }
    
    function renderPlaylists() {
        const container = document.getElementById('playlists-container');
        if (!container) return;
        const playlists = JSON.parse(localStorage.getItem('pop_playlists') || '{}');
        container.innerHTML = '';
        
        if (Object.keys(playlists).length === 0) {
            container.innerHTML = '<p style="color: var(--text-color);">No playlists yet. Create one from the music player.</p>';
            return;
        }
        
        Object.keys(playlists).forEach(name => {
            const list = playlists[name];
            const box = document.createElement('div');
            box.className = 'playlist-container';
            
            // Playlist header with delete button
            const header = document.createElement('div');
            header.className = 'playlist-header';
            header.innerHTML = `<h3>${name}</h3>`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-playlist-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete playlist';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete playlist "${name}"? Songs will not be removed.`)) {
                    delete playlists[name];
                    localStorage.setItem('pop_playlists', JSON.stringify(playlists));
                    renderPlaylists();
                    renderSidebarPlaylists();
                }
            });
            
            header.appendChild(deleteBtn);
            box.appendChild(header);
            
            const grid = document.createElement('div');
            grid.className = 'song-grid';
            
            if (list.length === 0) {
                grid.innerHTML = '<p style="color: var(--text-color);">No songs in this playlist</p>';
            } else {
                list.forEach((song, songIdx) => {
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'song-card-wrapper';
                    const card = document.createElement('div');
                    card.className = 'song-card';
                    card.innerHTML = `
                        <img src="${song.cover}" onerror="this.src='https://source.unsplash.com/random/150x150/?music'">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    `;
                    card.addEventListener('click', () => {
                        const idx = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
                        if (idx > -1) {
                            currentSongIndex = idx;
                            loadSong(currentSongIndex);
                            playSong();
                        }
                    });
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-song-btn';
                    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                    removeBtn.title = 'Remove from playlist';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        list.splice(songIdx, 1);
                        playlists[name] = list;
                        localStorage.setItem('pop_playlists', JSON.stringify(playlists));
                        renderPlaylists();
                    });
                    
                    cardWrapper.appendChild(card);
                    cardWrapper.appendChild(removeBtn);
                    grid.appendChild(cardWrapper);
                });
            }
            box.appendChild(grid);
            container.appendChild(box);
        });
    }
    
    // Initial render of all sections
    renderDiscover();
    renderFavorites();
    renderRecent();
    renderPlaylists();
    renderSidebarPlaylists();

    // Search input: live filter Discover
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = (e.target.value || '').toLowerCase().trim();
            const container = document.getElementById('discover-list');
            if (!container) return;
            // make sure Discover tab is visible while searching
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(m => m.classList.remove('active'));
            const discoverMenu = menuItems[1];
            if (discoverMenu) discoverMenu.classList.add('active');
            const contentSections = document.querySelectorAll('.content-section');
            contentSections.forEach(s => s.classList.remove('active'));
            const ds = document.getElementById('discover-section');
            if (ds) ds.classList.add('active');
            container.innerHTML = '';
            const grid = document.createElement('div');
            grid.className = 'song-grid';

            const list = q ? songs.filter(s => (s.title || '').toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q)) : (isShuffled ? shuffledQueue : originalQueue);

            list.forEach((song) => {
                const card = document.createElement('div');
                card.className = 'song-card';
                card.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}" onerror="this.src='https://source.unsplash.com/random/150x150/?music'">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                `;
                card.addEventListener('click', () => {
                    // find song in originalQueue and play it (disable shuffle for predictable mapping)
                    const idx = originalQueue.findIndex(s => s.title === song.title && s.artist === song.artist);
                    if (idx > -1) {
                        isShuffled = false;
                        shuffledQueue = [...originalQueue];
                        currentSongIndex = idx;
                        loadSong(currentSongIndex);
                        updatePlayerState();
                        playSong();
                    }
                });
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });
    }
    
    // Add animation to album art on load
    albumArt.addEventListener('load', function() {
        this.style.opacity = 1;
    });
});