// Level Navigation Utility
// Add functions here to help with switching, restarting, or navigating between levels in the game.

// Example: Go to a specific level by number
function goToLevel(levelNum) {
	if (typeof switchToLevel === 'function') {
		switchToLevel(levelNum);
	} else {
		console.warn('switchToLevel function not found.');
	}
}

// Example: Restart the current level
function restartCurrentLevel() {
	if (typeof levelNum !== 'undefined' && typeof switchToLevel === 'function') {
		switchToLevel(levelNum);
	} else {
		console.warn('Cannot restart level: levelNum or switchToLevel missing.');
	}
}
