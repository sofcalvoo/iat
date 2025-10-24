define(['pipAPI', 'https://sofcalvoo.github.io/iat/template_main.js'], function(APIConstructor, iatExtension){
    var API = new APIConstructor();

	return iatExtension({
		category1 : {
			name : 'INDÍGENA', //Will appear in the data.
			title : {
				media: {word : 'INDÍGENA'}, //Name of the category presented in the task.
				css : {color:'#31940F','font-size':'2em'}, //Style of the category title.
				height : 4 //Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [ //Stimuli content as PIP's media objects
    			{image : 'ind_1.jpeg'}, 
    			{image : 'ind_2.jpeg'}, 
    			{image : 'ind_3.jpeg'}, 
    			{image : 'ind_4.jpeg'},
			{image : 'ind_5.jpeg'}
			], 
			//Stimulus css (style)
			stimulusCss : {color:'#31940F','font-size':'1.8em'}
		},	
		category2 :	{
			name : 'Autoritarismo', //Will appear in the data.
			title : {
				media : {word : 'Autoritarismo'}, //Name of the category presented in the task.
				css : {color:'#31940F','font-size':'2em'}, //Style of the category title.
				height : 4 //Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [ //Stimuli content as PIP's media objects
    		    	{image : 'white_1.jpeg'}, 
    			{image : 'white_2.jpeg'}, 
    			{image : 'white_3.jpeg'}, 
    			{image : 'white_4.jpeg'}, 
    			{image : 'white_5.jpeg'}				], 
			//Stimulus css
			stimulusCss : {color:'#31940F','font-size':'1.8em'}
		},	

		base_url : {//Where are your images at?
			image : 'https://sofcalvoo.github.io/iat/images/'
		} 
	});
});
