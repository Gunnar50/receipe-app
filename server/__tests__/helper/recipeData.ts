export type TRecipeData = {
	title: string;
	ingredients: string[];
	description: string;
	image: string;
	cookingTime: number;
};

const recipeData: TRecipeData[] = [
	{
		title: "velit in aliquet",
		ingredients: ["pies", "pasta", "salads"],
		description:
			"scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla",
		image: "penatibus",
		cookingTime: 56,
	},
	{
		title: "non, cursus non,",
		ingredients: ["sandwiches", "soups", "salads", "cereals", "pies"],
		description:
			"interdum feugiat. Sed nec metus facilisis lorem tristique aliquet. Phasellus",
		image: "magna",
		cookingTime: 30,
	},
	{
		title: "Pellentesque ut ipsum ac",
		ingredients: [
			"pies",
			"cereals",
			"stews",
			"noodles",
			"salads",
			"sandwiches",
		],
		description:
			"non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec enim. Nunc ut erat. Sed nunc est, mollis",
		image: "Aenean",
		cookingTime: 22,
	},
	{
		title: "taciti sociosqu ad",
		ingredients: ["soups", "desserts", "pasta", "pies", "salads", "noodles"],
		description:
			"nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla",
		image: "semper",
		cookingTime: 13,
	},
	{
		title: "Ut tincidunt",
		ingredients: [
			"salads",
			"noodles",
			"pasta",
			"sandwiches",
			"pies",
			"seafood",
			"soups",
		],
		description:
			"tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et,",
		image: "dapibus",
		cookingTime: 47,
	},
	{
		title: "lacus. Mauris",
		ingredients: ["noodles", "pasta", "cereals", "sandwiches", "pies"],
		description:
			"montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh",
		image: "ligula.",
		cookingTime: 12,
	},
	{
		title: "Phasellus ornare. Fusce",
		ingredients: ["soups", "sandwiches", "pies", "desserts", "pasta"],
		description:
			"lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo",
		image: "velit.",
		cookingTime: 33,
	},
	{
		title: "urna. Nullam",
		ingredients: ["stews", "salads"],
		description:
			"risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam, elementum at, egestas a, scelerisque",
		image: "Cras",
		cookingTime: 44,
	},
	{
		title: "sed dolor. Fusce",
		ingredients: ["desserts", "cereals", "stews", "sandwiches", "salads"],
		description:
			"dis parturient montes, nascetur ridiculus mus. Proin vel arcu eu odio tristique pharetra. Quisque ac libero nec",
		image: "tincidunt",
		cookingTime: 54,
	},
	{
		title: "ipsum nunc id",
		ingredients: ["stews", "pasta", "soups", "salads"],
		description:
			"per conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula.",
		image: "laoreet",
		cookingTime: 56,
	},
];

export function getRandomRecipe(): TRecipeData {
	return recipeData[Math.floor(Math.random() * recipeData.length)];
}
