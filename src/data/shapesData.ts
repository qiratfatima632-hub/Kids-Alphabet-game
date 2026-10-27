import { ShapeItem } from '../types';

export const SHAPES_DATA: ShapeItem[] = [
  // 2D Shapes
  {
    id: 'circle',
    name: 'Circle',
    type: '2d',
    sides: 0,
    color: '#EF4444',
    description: 'A perfectly round curved shape with no straight sides and no sharp corners!',
    examples: [
      { name: 'Wall Clock', emoji: '⏰', description: 'Tells time with round ticking face' },
      { name: 'Shiny Coin', emoji: '🪙', description: 'Pocket money that rolls easily' },
      { name: 'Sweet Donut', emoji: '🍩', description: 'A tasty round pastry with sprinkles' }
    ],
    geometryType: 'circle'
  },
  {
    id: 'square',
    name: 'Square',
    type: '2d',
    sides: 4,
    color: '#3B82F6',
    description: 'A flat shape with 4 straight sides that are all exactly equal in length, and 4 right corners!',
    examples: [
      { name: 'Gift Box Top', emoji: '🎁', description: 'Square lid tied with a colorful bow' },
      { name: 'Window Pane', emoji: '🪟', description: 'Lets bright sunshine into the room' },
      { name: 'Chess Board', emoji: '🏁', description: 'Grid of 64 alternating black and white squares' }
    ],
    geometryType: 'square'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    type: '2d',
    sides: 3,
    color: '#10B981',
    description: 'A sharp 3-sided shape with 3 pointy corners. It is the strongest shape in architecture!',
    examples: [
      { name: 'Pizza Slice', emoji: '🍕', description: 'Yummy cheesy slice cut from a pizza' },
      { name: 'Warning Sign', emoji: '⚠️', description: 'Triangular road sign to stay safe' },
      { name: 'Sailboat Sail', emoji: '⛵', description: 'Catches the breeze to move across water' }
    ],
    geometryType: 'triangle'
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    type: '2d',
    sides: 4,
    color: '#F59E0B',
    description: 'A 4-sided shape with 4 corners where opposite sides are parallel and equal in length!',
    examples: [
      { name: 'Room Door', emoji: '🚪', description: 'Tall rectangular door to walk through' },
      { name: 'Smartphone', emoji: '📱', description: 'Screen shaped like a sleek rectangle' },
      { name: 'Storybook', emoji: '📖', description: 'Filled with fun pages and colorful pictures' }
    ],
    geometryType: 'rectangle'
  },
  {
    id: 'oval',
    name: 'Oval',
    type: '2d',
    sides: 0,
    color: '#8B5CF6',
    description: 'An elongated round shape that looks like a gently stretched circle or an egg!',
    examples: [
      { name: 'Farm Egg', emoji: '🥚', description: 'Naturally oval shell keeping bird chick safe' },
      { name: 'Rugby Ball', emoji: '🏉', description: 'Oval shaped ball easy to catch and kick' },
      { name: 'Bathroom Mirror', emoji: '🪞', description: 'Curved glass frame reflecting smiles' }
    ],
    geometryType: 'oval'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    type: '2d',
    sides: 4,
    color: '#EC4899',
    description: 'Also called a rhombus! A tilted square with 4 equal straight sides and opposite matching angles.',
    examples: [
      { name: 'Flying Kite', emoji: '🪁', description: 'Diamond paper sail riding high on the breeze' },
      { name: 'Playing Card', emoji: '♦️', description: 'Sparkling red diamond suit card' },
      { name: 'Street Crossing Sign', emoji: '🚧', description: 'Diamond caution sign on the road' }
    ],
    geometryType: 'diamond'
  },
  {
    id: 'star',
    name: 'Star',
    type: '2d',
    sides: 10,
    color: '#FBBF24',
    description: 'A twinkling 5-pointed geometric figure that shines bright and celebrates success!',
    examples: [
      { name: 'Night Star', emoji: '⭐', description: 'Glows in outer space millions of miles away' },
      { name: 'Gold Medal Star', emoji: '🌟', description: 'Special reward badge for superstar learners' },
      { name: 'Sea Star', emoji: '⭐️', description: 'Friendly five-armed ocean starfish' }
    ],
    geometryType: 'star'
  },
  {
    id: 'heart',
    name: 'Heart',
    type: '2d',
    sides: 2,
    color: '#F43F5E',
    description: 'A loving shape with two rounded lobes at the top meeting at a pointy point at the bottom!',
    examples: [
      { name: 'Valentine Card', emoji: '💌', description: 'Heart filled with kind words and love' },
      { name: 'Heart Candy', emoji: '🍬', description: 'Sweet sugar treat shaped like love' },
      { name: 'Empathy Badge', emoji: '💖', description: 'Symbol of caring for friends and pets' }
    ],
    geometryType: 'heart'
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    type: '2d',
    sides: 5,
    color: '#06B6D4',
    description: 'A 5-sided polygon with 5 interior angles. Often looks like a cute little house outline!',
    examples: [
      { name: 'School Crossing Sign', emoji: '🚸', description: '5-sided pedestrian safety sign' },
      { name: 'Soccer Ball Patch', emoji: '⚽', description: 'Black pentagon patches on white balls' },
      { name: 'Okra Slice', emoji: '🥬', description: 'Veggie slice revealing a natural 5-star ring' }
    ],
    geometryType: 'pentagon'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    type: '2d',
    sides: 6,
    color: '#A855F7',
    description: 'A 6-sided polygon with 6 corners! Nature loves hexagons for strong, efficient building.',
    examples: [
      { name: 'Bee Honeycomb', emoji: '🍯', description: 'Hexagonal wax cells storing golden honey' },
      { name: 'Metal Nut Bolt', emoji: '🔩', description: 'Six flat edges easy for wrenches to grip' },
      { name: 'Snowflake Crystal', emoji: '❄️', description: 'Six symmetrical ice crystal arms' }
    ],
    geometryType: 'hexagon'
  },

  // 3D Shapes
  {
    id: 'sphere',
    name: 'Sphere',
    type: '3d',
    sides: 0,
    faces: 1,
    color: '#3B82F6',
    description: 'A 3D solid where every single point on its curved surface is equally far from the center!',
    examples: [
      { name: 'Soccer Ball', emoji: '⚽', description: 'Bouncy sphere you can kick across the field' },
      { name: 'Planet Earth Globe', emoji: '🌍', description: 'Our round blue planet spinning in space' },
      { name: 'Juicy Orange', emoji: '🍊', description: 'Round citrus fruit with sweet juice' }
    ],
    geometryType: 'sphere'
  },
  {
    id: 'cube',
    name: 'Cube',
    type: '3d',
    sides: 12,
    faces: 6,
    color: '#10B981',
    description: 'A 3D solid box with 6 identical square faces, 12 straight edges, and 8 sharp corners!',
    examples: [
      { name: 'Game Dice', emoji: '🎲', description: 'Rolled in board games with 1 to 6 dots' },
      { name: 'Toy Building Block', emoji: '🧱', description: 'Colorful wooden block to stack tall towers' },
      { name: 'Ice Cube', emoji: '🧊', description: 'Chilly frozen water keeping drinks cool' }
    ],
    geometryType: 'cube'
  },
  {
    id: 'cone',
    name: 'Cone',
    type: '3d',
    sides: 1,
    faces: 2,
    color: '#F59E0B',
    description: 'A 3D shape with a flat circular base that smoothly tapers up to a sharp single tip (apex)!',
    examples: [
      { name: 'Ice Cream Cone', emoji: '🍦', description: 'Waffle cone holding cold sweet scoops' },
      { name: 'Party Hat', emoji: '🎉', description: 'Fun celebratory cone worn on birthdays' },
      { name: 'Traffic Cone', emoji: '🚧', description: 'Bright orange cone guiding cars safely' }
    ],
    geometryType: 'cone'
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    type: '3d',
    sides: 2,
    faces: 3,
    color: '#EC4899',
    description: 'A 3D shape with two identical flat round ends and one smooth curved surface connecting them!',
    examples: [
      { name: 'Soda Can', emoji: '🥤', description: 'Aluminum can holding fizzy refreshment' },
      { name: 'Marching Drum', emoji: '🥁', description: 'Cylindrical instrument struck with sticks' },
      { name: 'Flashlight Battery', emoji: '🔋', description: 'Powers up our favorite electronic toys' }
    ],
    geometryType: 'cylinder'
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    type: '3d',
    sides: 8,
    faces: 5,
    color: '#D97706',
    description: 'A 3D shape with a square base and four triangular faces that meet at a pointed apex!',
    examples: [
      { name: 'Egyptian Pyramid', emoji: '🏛️', description: 'Ancient wonder standing in the desert' },
      { name: 'Camping Tent', emoji: '⛺', description: 'Cozy outdoor shelter beneath the stars' },
      { name: 'Toy Pyramid Block', emoji: '🔺', description: 'Roof topper for building castle towers' }
    ],
    geometryType: 'pyramid'
  },
  {
    id: 'cuboid',
    name: 'Cuboid',
    type: '3d',
    sides: 12,
    faces: 6,
    color: '#8B5CF6',
    description: 'Also called a rectangular prism! A 3D box where faces are rectangles rather than equal squares.',
    examples: [
      { name: 'Clay Brick', emoji: '🧱', description: 'Sturdy block used to build strong houses' },
      { name: 'Cereal Box', emoji: '🥣', description: 'Tall box packed with breakfast goodies' },
      { name: 'Thick Dictionary', emoji: '📚', description: 'Rectangular book filled with knowledge' }
    ],
    geometryType: 'cuboid'
  }
];
