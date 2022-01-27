<script lang="ts">
  let textArea;

	enum Color {
		Gray = 'gray',
		Orange = 'orange',
		Green = 'green'
	}

	const Colors = [Color.Gray, Color.Orange, Color.Green];
	// create a 5x6 matrix
	let matrix = new Array(6);
	for (let i = 0; i < matrix.length; i++) {
		matrix[i] = new Array(5).fill(Colors[0]);
	}

	const incrementSquare = (square: Color) => {
		let index = Colors.indexOf(square);
		if (index === Colors.length - 1) {
			return Colors[0];
		}
		return Colors[index + 1];
	};

	const colorToEmoji = (color: Color) => {
		switch (color) {
			case Color.Gray:
				return '⬛';
			case Color.Orange:
				return '🟧';
			case Color.Green:
				return '🟩';
		}
	};

	const matrixToEmoji = (matrix: Color[][]) => {
		let emojiMatrix = '';
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				emojiMatrix += colorToEmoji(matrix[i][j]);
			}
			if(matrix[i].filter(c => c === Color.Green).length === matrix[i].length) {
				break;
			}
			emojiMatrix += '\n';
		}
		return emojiMatrix;
	};
</script>

<template>
	<h1>Wordle</h1>
	<!-- create a 5x6 grid of squares -->
	{#each matrix as row}
		<div flex="~" gap-2 mb-2>
			{#each row as square}
				<div
					on:click={() => (square = incrementSquare(square))}
					w-20
					h-20
					style:background-color={square}
				/>
			{/each}
		</div>
	{/each}
	<div flex="~" items-center gap-4>
	<textarea bind:this={textArea} rows="6" readonly value={matrixToEmoji(matrix)}/>
	<button bg-dark text-light p-2 h-12 rounded-lg on:click={async () => {
		textArea.select()
    await navigator.clipboard.writeText(textArea.value);
	}}>
	Copy to Clipboard
	</button>
	</div>
</template>
