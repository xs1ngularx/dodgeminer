// Lanes: 0 = Left, 1 = Middle, 2 = Right
export const Level1Patterns = [
    {
        name: "Straight Line Ores",
        height: 800, // How much vertical space this chunk takes up
        items: [
            { lane: 1, y: 0, type: 'ore' },
            { lane: 1, y: 100, type: 'ore' },
            { lane: 1, y: 200, type: 'ore' },
            { lane: 1, y: 300, type: 'ore' },
            { lane: 1, y: 400, type: 'ore' },
            { lane: 1, y: 500, type: 'ore' },
            { lane: 1, y: 600, type: 'ore' },
            { lane: 1, y: 700, type: 'ore' }
        ]
    },
    {
        name: "Mine Zig-Zag",
        height: 1100,
        items: [
            { lane: 0, y: 0, type: 'mine' },
            { lane: 1, y: 250, type: 'mine' },
            { lane: 2, y: 500, type: 'mine' },
            { lane: 1, y: 750, type: 'mine' },
            { lane: 0, y: 1000, type: 'mine' }
        ]
    },
    {
        name: "High Density Ores",
        height: 900,
        items: [
            { lane: 0, y: 0, type: 'ore' },
            { lane: 1, y: 0, type: 'mine' },
            { lane: 2, y: 0, type: 'ore' },

            { lane: 0, y: 150, type: 'ore' },
            { lane: 1, y: 150, type: 'mine' },
            { lane: 2, y: 150, type: 'ore' },

            { lane: 0, y: 300, type: 'ore' },
            { lane: 1, y: 300, type: 'mine' },
            { lane: 2, y: 300, type: 'ore' },

            { lane: 0, y: 450, type: 'ore' },
            { lane: 1, y: 450, type: 'ore' },
            { lane: 2, y: 450, type: 'ore' },

            { lane: 0, y: 600, type: 'mine' },
            { lane: 1, y: 600, type: 'ore' },
            { lane: 2, y: 600, type: 'mine' },

            { lane: 0, y: 800, type: 'ore' },
            { lane: 1, y: 800, type: 'mine' },
            { lane: 2, y: 800, type: 'ore' },
        ]
    }
];

export const Level2Patterns = [
    {
        name: "Stone Pillars",
        height: 500,
        items: [
            { lane: 0, y: 0, type: 'mine' }, { lane: 2, y: 0, type: 'mine' },
            { lane: 1, y: 250, type: 'ore' },
            { lane: 0, y: 400, type: 'mine' }, { lane: 2, y: 400, type: 'mine' }
        ]
    }
];