export function fetchPoke() {
    interface PokemonData {
        sprite: string;
        cry: string;
    }

    let allPokemonData: PokemonData[] = [];
    const loadingStatus = document.getElementById('loading-status') as HTMLDivElement | null;

    if (loadingStatus) {
        loadingStatus.textContent = 'Loading Pokémon data... Please wait.';
        loadingStatus.classList.add('loading-message');
        loadingStatus.classList.remove('text-green-600', 'text-red-600');
    }

    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((json: { results: { name: string; url: string; }[] }) => {
            const pokemonList = json.results;

            return Promise.all(pokemonList.map((pokemon: { name: string; url: string }) =>
                fetch(pokemon.url)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status} for ${pokemon.name}`);
                        }
                        return res.json();
                    })
                    .then((pokeData: { sprites?: { front_default?: string }; cries?: { legacy?: string } }) => {
                        if (pokeData.sprites?.front_default && pokeData.cries?.legacy) {
                            allPokemonData.push({
                                sprite: pokeData.sprites.front_default,
                                cry: pokeData.cries.legacy
                            });
                        }
                    })
                    .catch(error => {
                        console.error(`Error fetching data for ${pokemon.name}:`, error);
                    })
            ));
        })
        .then(() => {
            console.log('Finished fetching Pokémon URLs. Now preloading images...');
            if (loadingStatus) {
                loadingStatus.textContent = 'Preloading Pokémon images...';
            }

            const imagePromises = allPokemonData.map(data => {
                return new Promise<void>((resolve, reject) => { // 'reject' is now available to be used
                    const img = new Image();
                    img.src = data.sprite;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error(`Failed to preload image: ${data.sprite}`); // Log the error
                        reject(new Error(`Failed to load image: ${data.sprite}`)); // <-- **THIS IS THE CHANGE**
                    };
                });
            });

            return Promise.all(imagePromises);
        })
        .then(() => {
            console.log('All Pokémon data and sprites preloaded. Application ready.');

            if (loadingStatus) {
                if (allPokemonData.length > 0) {
                    loadingStatus.textContent = 'Pokémon data loaded! Click anywhere to spawn.';
                    loadingStatus.classList.remove('loading-message', 'text-red-600');
                    loadingStatus.classList.add('text-green-600');
                } else {
                    loadingStatus.textContent = 'Failed to load any Pokémon sprites or cries.';
                    loadingStatus.classList.remove('loading-message', 'text-green-600');
                    loadingStatus.classList.add('text-red-600');
                }
            }

            document.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault();

                if (allPokemonData.length === 0) {
                    console.warn("No Pokémon data loaded, cannot spawn.");
                    return;
                }

                const randomIndex = Math.floor(Math.random() * allPokemonData.length);
                const selectedPokemon = allPokemonData[randomIndex];

                const sprite = document.createElement("img");
                sprite.src = selectedPokemon.sprite;

                sprite.style.position = 'absolute';
                sprite.style.zIndex = '1000';
                sprite.style.cursor = 'pointer';
                sprite.style.maxWidth = '200px';
                sprite.style.height = 'auto';

                const initialLeft = Math.random() * (window.innerWidth - 200);
                sprite.style.left = `${initialLeft}px`;
                sprite.style.top = '-100px';
                sprite.style.opacity = '0';

                document.body.appendChild(sprite);

                if (selectedPokemon.cry) {
                    const audio = new Audio(selectedPokemon.cry);
                    audio.play().catch(e => console.error("Error playing audio:", e));
                }

                const applyFinalPosition = () => {
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    const spriteWidth = sprite.offsetWidth;
                    const spriteHeight = sprite.offsetHeight;

                    const finalRandomLeft = Math.random() * (viewportWidth - spriteWidth);
                    const finalRandomTop = Math.random() * (viewportHeight - spriteHeight);

                    sprite.style.left = `${finalRandomLeft}px`;
                    sprite.style.top = `${finalRandomTop}px`;
                    sprite.style.opacity = '1';
                };

                sprite.onload = applyFinalPosition;

                if (sprite.complete) {
                    applyFinalPosition();
                }

                setTimeout(() => {
                    if (sprite.parentNode) {
                        sprite.parentNode.removeChild(sprite);
                    }
                }, 7000);
            });
        })
        .catch(error => { // This catch block will now handle image preloading failures as well
            console.error("Error during application startup (data or image preloading):", error);
            if (loadingStatus) {
                loadingStatus.textContent = `Error loading Pokémon: ${error.message}`;
                loadingStatus.classList.remove('loading-message', 'text-green-600');
                loadingStatus.classList.add('text-red-600');
            }
        });
}

