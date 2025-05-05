// script.js

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Helper function to save ideas to Local Storage ---
    function saveIdeas(ideas) {
        try {
            localStorage.setItem('ideas', JSON.stringify(ideas));
        } catch (e) {
            console.error("Error saving ideas to Local Storage:", e);
            // Optionally, display a user-friendly message if storage fails
        }
    }

    // --- Helper function to get ideas from Local Storage ---
    function getIdeas() {
        try {
            const ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
            // Ensure ideas is always an array, even if localStorage is corrupted
            return Array.isArray(ideas) ? ideas : [];
        } catch (e) {
            console.error("Error loading ideas from Local Storage:", e);
            return []; // Return an empty array on error
        }
    }

    // --- Logic for the Submit Idea Page (submit.html) ---
    // Check if the current page is submit.html
    if (window.location.pathname.includes('submit.html')) {
        // Get references to the necessary DOM elements
        const submitIdeaBtn = document.getElementById('submitIdeaBtn');
        const ideaInput = document.getElementById('ideaInput');
        const message = document.getElementById('message');

        // Add an event listener to the submit button
        if (submitIdeaBtn && ideaInput && message) { // Ensure elements exist
            submitIdeaBtn.addEventListener('click', () => {
                // Get the idea text from the textarea and remove leading/trailing whitespace
                const idea = ideaInput.value.trim();

                // Check if the idea input is not empty
                if (idea) {
                    // Get the existing ideas from local storage
                    const ideas = getIdeas();

                    // Create a new idea object
                    const newIdea = {
                        id: Date.now(), // Use a timestamp as a simple unique ID
                        text: idea,
                        voted: false, // Flag to check if the idea has been voted on
                        liked: null, // Store the vote: true for Yes, false for No, null initially
                        review: '' // Store the detailed review if voted No
                    };

                    // Add the new idea to the array
                    ideas.push(newIdea);

                    // Save the updated array of ideas back to local storage
                    saveIdeas(ideas);

                    // Clear the input field
                    ideaInput.value = '';

                    // Display a success message
                    message.textContent = 'Idea submitted successfully!';
                    message.classList.remove('hidden'); // Make the message visible
                    message.classList.remove('text-red-600'); // Ensure it's green
                    message.classList.add('text-green-600');

                    // Hide the message after 3 seconds
                    setTimeout(() => {
                        message.classList.add('hidden');
                    }, 3000);

                } else {
                     // Optional: Show a message if the input is empty
                    message.textContent = 'Please enter an idea.';
                    message.classList.remove('hidden');
                    message.classList.remove('text-green-600');
                    message.classList.add('text-red-600');
                     setTimeout(() => {
                        message.classList.add('hidden');
                    }, 3000);
                }
            });
        }
    }

    // --- Logic for the Review Ideas Page (review.html) ---
    // Check if the current page is review.html
    if (window.location.pathname.includes('review.html')) {
        // Get references to the necessary DOM elements
        const ideaCard = document.getElementById('ideaCard');
        const currentIdeaText = document.getElementById('currentIdeaText');
        const likeBtn = document.getElementById('likeBtn');
        const dislikeBtn = document.getElementById('dislikeBtn');
        const reviewBox = document.getElementById('reviewBox');
        const detailedReviewInput = document.getElementById('detailedReviewInput');
        const submitReviewBtn = document.getElementById('submitReviewBtn');
        const noIdeasMessage = document.getElementById('noIdeasMessage');

        // Get the ideas from local storage
        let ideas = getIdeas();
        // Keep track of the index of the current idea being reviewed
        // We start at 0 and only increment when an idea is NOT removed
        let currentIdeaIndex = 0;

         // Function to display an idea at a specific index
        function displayIdea(index) {
            // Check if there are ideas and the index is valid
            if (ideas.length > 0 && index < ideas.length) {
                const idea = ideas[index];
                // Set the text content of the idea card
                currentIdeaText.textContent = idea.text;
                // Show the idea card and hide the 'no ideas' message
                ideaCard.classList.remove('hidden');
                noIdeasMessage.classList.add('hidden');
                // Hide the review box and clear its input for the new idea
                reviewBox.classList.add('hidden');
                detailedReviewInput.value = '';
            } else {
                // If no more ideas or no ideas at all, hide the card and show the 'no ideas' message
                ideaCard.classList.add('hidden');
                reviewBox.classList.add('hidden');
                noIdeasMessage.classList.remove('hidden');
            }
        }

        // Helper function to process a vote and move to the next idea
        function processVote(liked, reviewText = '') {
            if (currentIdeaIndex < ideas.length) {
                // Update the idea's status and review
                ideas[currentIdeaIndex].voted = true;
                ideas[currentIdeaIndex].liked = liked;
                ideas[currentIdeaIndex].review = reviewText;

                // Remove the idea from the array
                ideas.splice(currentIdeaIndex, 1);

                // Save the updated array of ideas back to local storage
                saveIdeas(ideas);

                // Display the next idea. Since an element was removed, the next idea
                // is now at the same currentIdeaIndex. We do NOT increment the index here.
                displayIdea(currentIdeaIndex);
            }
        }


        // Initial display of the first idea
        displayIdea(currentIdeaIndex);

        // Add event listener for the 'Yes' button (Like)
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                processVote(true); // Process as a 'liked' vote
            });
        }


        // Add event listener for the 'No' button (Dislike)
        if (dislikeBtn && reviewBox) {
            dislikeBtn.addEventListener('click', () => {
                 // Ensure we are on a valid idea
                 if (currentIdeaIndex < ideas.length) {
                    // If 'No' is clicked, show the detailed review box
                    reviewBox.classList.remove('hidden');
                    // The voting and saving will happen when the detailed review is submitted
                 }
            });
        }


        // Add event listener for submitting the detailed review (after voting 'No')
        if (submitReviewBtn && detailedReviewInput && reviewBox) {
            submitReviewBtn.addEventListener('click', () => {
                // Ensure we are on a valid idea
                if (currentIdeaIndex < ideas.length) {
                    const detailedReview = detailedReviewInput.value.trim();
                    processVote(false, detailedReview); // Process as a 'disliked' vote with review

                    // Hide the review box after processing
                    reviewBox.classList.add('hidden');
                }
            });
        }
    }
});
