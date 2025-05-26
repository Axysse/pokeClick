export function fetchPoke() {
    let allSprite: string[] = []
    fetch('https://pokeapi.co/api/v2/pokemon?limit=250')
        .then(response => response.json())
        .then(json => {
            const pokemonList = json.results
            // Use Promise.all to wait for all individual Pokémon fetches to complete
            return Promise.all(pokemonList.map((pokemon: any) =>
                fetch(pokemon.url)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then(pokeData => {
                        // Check if sprites and front_default exist before pushing
                        if (pokeData.sprites && pokeData.sprites.front_default) {
                            allSprite.push(pokeData.sprites.front_default);
                        }
                    })
            ));
        })
        .then(() => {
            console.log(allSprite);

            document.addEventListener("click", (event) => {
                        // Ensure there are sprites to display
                        if (allSprite.length === 0) {
                            console.warn("No Pokémon sprites loaded, cannot spawn.");
                            return;
                        }

                        // Create a new image element for the sprite
                        const sprite = document.createElement("img");
                        // Select a random sprite from the loaded ones
                        const randomIndex = Math.floor(Math.random() * allSprite.length);
                        sprite.src = allSprite[randomIndex];

                        // Set initial styles for position and visibility
                        sprite.style.position = 'absolute';
                        sprite.style.zIndex = '1000'; // Ensure the sprite appears on top of other content
                        sprite.style.cursor = 'pointer'; // Indicate it's interactive (optional)
                        sprite.style.maxWidth = '200px'; // Limit sprite size
                        sprite.style.height = 'auto';
                        sprite.style.left = `${event.clientX - sprite.offsetWidth / 2}px`; // Position horizontally at click
                        sprite.style.top = '-100px'; // Start above the viewport for falling animation

                        // Append the sprite to the body
                        document.body.appendChild(sprite);

                        // Once the sprite image has loaded, trigger the animation
                        sprite.onload = () => {
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;

                            // Get the actual dimensions of the loaded sprite
                            const spriteWidth = sprite.offsetWidth;
                            const spriteHeight = sprite.offsetHeight;

                            // Calculate random positions within the viewport,
                            // ensuring the sprite is fully visible and doesn't go off edges.
                            // The horizontal position is now based on the click event's X coordinate
                            const randomLeft = Math.random() * (viewportWidth - spriteWidth);
                            const randomTop = Math.random() * (viewportHeight - spriteHeight);

                            // Apply the final positions and make it visible to trigger the transition
                            sprite.style.left = `${randomLeft}px`;
                            sprite.style.top = `${randomTop}px`;
                            sprite.style.opacity = '1'; // Fade in
                        };

                        // Optional: Remove the sprite after a short delay (e.g., 5 seconds)
                        // This prevents too many sprites from cluttering the screen.
                        setTimeout(() => {
                            if (sprite.parentNode) {
                                sprite.parentNode.removeChild(sprite);
                            }
                        }, 7000); 
                    });
                })
        }


