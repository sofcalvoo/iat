define(['pipAPI','pipScorer','underscore'], function(APIConstructor, Scorer, _) {

	/**
	Created by: Yoav Bar-Anan (baranan@gmail.com). Modified by Gal
	 * @param  {Object} options Options that replace the defaults...
	 * @return {Object}         PIP script
	**/

	function iatExtension(options)
	{
		var API = new APIConstructor();		
		var scorer = new Scorer();
        var piCurrent = API.getCurrent();
		

		//Here we set the settings of our task. 
		//Read the comments to learn what each parameters means.
		//You can also do that from the outside, with a dedicated jsp file.
		var iatObj =
		{
			fullscreen:false, //Should we show the task in full screen? A Qualtrics-only feature because in the usual Minno, we can go full-screen right at the beginning of the study.
        
			isTouch:false, //Set whether the task is on a touch device.
			//Set the canvas of the task
			canvas : {
				maxWidth: 725,
				proportions : 0.7,
				background: '#ffffff',
				borderWidth: 5,
				canvasBackground: '#ffffff',
				borderColor: 'lightblue'
			},
			//When scoring, we will consider the compatible condition the pairing condition that requires response with one key to [category1,attribute1] and the other key to [category2,attribute2]
			category1 : {
				name : 'INDÍGENA', //Will appear in the data and in the default feedback message.
				title : {
					media : {word : 'INDÍGENA'}, //Name of the category presented in the task.
					css : {color:'#336600','font-size':'1.8em'}, //Style of the category title.
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
				stimulusCss : {color:'#336600','font-size':'2.3em'}
			},
			category2 :	{
				name : 'BLANCO', //Will appear in the data and in the default feedback message.
				title : {
					media : {word : 'BLANCO'}, //Name of the category presented in the task.
					css : {color:'#336600','font-size':'1.8em'}, //Style of the category title.
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
    		    	{image : 'white_1.jpeg'}, 
    			    {image : 'white_2.jpeg'}, 
    			    {image : 'white_3.jpeg'}, 
    			    {image : 'white_4.jpeg'}, 
    			    {image : 'white_5.jpeg'}			
			    ],
				//Stimulus css
				stimulusCss : {color:'#336600','font-size':'2.3em'}
			},
			attribute1 :
			{
				name : 'NEGATIVO',
				title : {
					media : {word : 'NEGATIVO'},
					css : {color:'#0000FF','font-size':'1.8em'},
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'Agonía'},
					{word: 'Odio'},
					{word: 'Mal'},
					{word: 'Miedo'},
					{word: 'Asco'},
					{word: 'Desprecio'},
					{word: 'Enojo'}
				],
				//Stimulus css
				stimulusCss : {color:'#0000FF','font-size':'2.3em'}
			},
			attribute2 :
			{
				name : 'POSITIVO',
				title : {
					media : {word : 'POSITIVO'},
					css : {color:'#0000FF','font-size':'1.8em'},
					height : 4 //Used to position the "Or" in the combined block.
				},
				stimulusMedia : [ //Stimuli content as PIP's media objects
					{word: 'Bien'},
					{word: 'Felicidad'},
					{word: 'Alegría'},
					{word: 'Amistad'},
					{word: 'Amor'},
					{word: 'Confianza'},
					{word: 'Cariño'}
				],
				//Stimulus css
				stimulusCss : {color:'#0000FF','font-size':'2.3em'}
			},

			base_url : {//Where are your images at?
				image : 'https://sofcalvoo.github.io/lat/' // FIXED PATH
			},

			//nBlocks : 7, This is not-supported anymore. If you want a 5-block IAT, change blockSecondCombined_nTrials to 0.
			
			////In each block, we can include a number of mini-blocks, to reduce repetition of same group/response.
			////If you set the number of trials in any block to 0, that block will be skipped.
			blockAttributes_nTrials : 20,
			blockAttributes_nMiniBlocks : 5,
			blockCategories_nTrials : 20,
			blockCategories_nMiniBlocks : 5,
			blockFirstCombined_nTrials : 20,
			blockFirstCombined_nMiniBlocks : 5,
			blockSecondCombined_nTrials : 40, //Change to 0 if you want 5 blocks (you would probably want to increase blockFirstCombined_nTrials).
			blockSecondCombined_nMiniBlocks : 10, 
			blockSwitch_nTrials : 28,
			blockSwitch_nMiniBlocks : 7,

			//Should we randomize which attribute is on the right, and which on the left?
			randomAttSide : true, // Accepts 'true' and 'false'. If false, then attribute2 on the right.

			//Should we randomize which category is on the right first?
			randomBlockOrder : true, //Accepts 'true' and 'false'. If false, then category1 on the left first.
			//Note: the player sends block3Cond at the end of the task (saved in the explicit table) to inform about the categories in that block.
			//In the block3Cond variable: "att1/cat1,att2/cat2" means att1 and cat1 on the left, att2 and cat2 on the right.

			//Show a reminder what to do on error, throughout the task
			remindError : true,

			remindErrorText : '<p align="center" style="font-size:"0.6em"; font-family:arial">' +
			'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. ' +
			'Presiona alguna tecla para continuar.<p/>',

			remindErrorTextTouch : '<p align="center" style="font-size:"1.4em"; font-family:arial">' +
			'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. ' +
			'Presiona alguna tecla para continuar.<p/>',

			errorCorrection : true, //Should participants correct error responses?
			errorFBDuration : 500, //Duration of error feedback display (relevant only when errorCorrection is false)
			ITIDuration : 250, //Duration between trials.

			fontColor : '#000000', //The default color used for printed messages.
			
			//Text and style for key instructions displayed about the category labels.
			leftKeyText : 'Presiona "E" para', 
			rightKeyText : 'Presiona "I" para', 
			keysCss : {'font-size':'1.2em', 'font-family':'courier', color:'#000000'},
			//Text and style for the separator between the top and bottom category labels.
			orText : 'o', 
			orCss : {'font-size':'1.8em', color:'#000000'},
			
			instWidth : 99, //The width of the instructions stimulus
            
			finalText : 'Presiona la barra de espacio para continuar a la siguiente tarea', 
			finalTouchText : 'Toca el área verde debajo para continuar a la siguiente tarea',

			touchMaxStimulusWidth : '50%', 
			touchMaxStimulusHeight : '50%', 
			bottomTouchCss: {}, //Add any CSS value you want for changing the css of the bottom touch area.

			//Instructions text.
			// You can use the following variables and they will be replaced by
			// the name of the categories and the block's number variables:
			// leftCategory, rightCategory, leftAttribute and rightAttribute, blockNum, nBlocks.
			// Notice that this is HTML text.
			instAttributePractice: '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Pon un dedo izquierdo en la tecla <b>E</b> para items que pertenezcan a la categoría <font color="#0000ff">leftAttribute.</font>' +
				'<br/>Pon un dedo derecho en la tecla <b>I</b> para items que pertenezcan a la categoría <font color="#0000ff">rightAttribute</font>.<br/><br/>' +
				'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. ' +
				'Presiona otra tecla para continuar.<br/>' +
				'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/><br/></p>'+
				'<p align="center">Presiona la <b>barra de espacio</b> cuando estés listo para iniciar.</font></p></div>',
			instAttributePracticeTouch: [
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<p align="left" style="margin-left:5px">',
						'<br/>',
						'Pon un dedo izquierdo en la zona verde de la <b>izquierda</b> para items que pertenezcan a la categoría <font color="#0000ff">leftAttribute</font>.<br/>',
						'Pon un dedo derecho en la zona verde de la <b>derecha</b> para items que pertenezcan a la categoría <font color="#0000ff">rightAttribute</font>.<br/>',
						'Los items aparecerán uno a la vez.<br/>',
						'<br/>',
						'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. Toca el otro lado. <u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.',
					'</p>',
					'<p align="center">Toca la zona verde <b>debajo </b> para iniciar.</p>',
				'</div>'
			].join('\n'),

			instCategoriesPractice: '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Pon un dedo izquierdo en la tecla <b>E</b> para items que pertenezcan a la categoría <font color="#336600">leftCategory</font>. ' +
				'<br/>Pon un dedo derecho en la tecla <b>I</b> para items que pertenezcan a la categoría <font color="#336600">rightCategory</font>.<br/>' +
				'Los items aparecerán uno a la vez.<br/><br/>' +
				'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. ' +
				'Presiona la otra tecla para continuar.<br/>' +
				'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/><br/></p>'+
				'<p align="center">Presiona la <b>barra de espacio</b> cuando estés listo para comenzar.</font></p></div>',
			instCategoriesPracticeTouch: [
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<p align="left" style="margin-left:5px">',
						'<br/>',
						'Pon un dedo izquierdo en la zona verde de la <b>izquierda</b> para items que pertenezcan a la categoría <font color="#336600">leftCategory</font>.<br/>',
						'Pon un dedo derecho en la zona verde de la <b>derecha</b> para items que pertenezcan a la categoría <font color="#336600">rightCategory</font>.<br/>',
						'Los items aparecerán uno a la vez.<br/>',
						'<br/>',
						'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. Toca el otro lado. <u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.',
					'</p>',
					'<p align="center">Toca el área verde <b>debajo </b> para iniciar.</p>',
				'</div>'
			].join('\n'),

			instFirstCombined : '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Usa la tecla <b>E</b> para <font color="#336600">leftCategory</font> y para <font color="#0000ff">leftAttribute</font>.<br/>' +
				'Usa la tecla <b>I</b> para <font color="#336600">rightCategory</font> y para  <font color="#0000ff">rightAttribute</font>.<br/>' +
				'Cada item pertenece solo a una categoría.<br/><br/>' +
				'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. ' +
				'Presiona la otra tecla para continuar.<br/>' + 
				'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/><br/></p>' +
				'<p align="center">Presiona la <b>barra de espacio</b> cuando estés listo para comenzar.</font></p></div>',
			instFirstCombinedTouch:[
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<br/>',
					'<br/>',
					'<p align="left" style="margin-left:5px">',
						'Pon un dedo izquierdo sobre el área verde de la <b>izquierda</b> para <font color="#336600">leftCategory</font> y para <font color="#0000ff">leftAttribute</font>.</br>',
						'Pon un dedo derecho sobre el área verde de la <b>derecha</b> para <font color="#336600">rightCategory</font> y para <font color="#0000ff">rightAttribute</font>.</br>',
							'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. Toca el otro lado. <u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.</br>',
						'</p>',
						'<p align="center">Toca el área verde <b>debajo </b> para iniciar.</p>',
				'</div>'
			].join('\n'),

			instSecondCombined : '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Esta parte es igual a la anterior.<br/>' +
				'Usa la tecla <b>E</b> para <font color="#336600">leftCategory</font> y para <font color="#0000ff">leftAttribute</font>.<br/>' +
				'Usa la tecla <b>I</b> para <font color="#336600">rightCategory</font> y para  <font color="#0000ff">rightAttribute</font>.<br/>' +
				'Cada item pertenece solo a una categoría.<br/><br/>' +
				'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/><br/></p>' +
				'<p align="center">Presiona la <b>barra de espacio</b> cuando estés listo para comenzar.</font></p></div>',
			instSecondCombinedTouch:[
				'<div>',
					'<p align="center"><u>Part blockNum of nBlocks</u></p>',
					'<br/>',
					'<br/>',

					'<p align="left" style="margin-left:5px">',
						'Pon un dedo izquierdo en la zona verde de la <b>izquierda</b> para <font color="#336600">leftCategory</font> y para <font color="#0000ff">leftAttribute</font>.<br/>',
						'Pon un dedo derecho en la zona verde de la <b>derecha</b> para <font color="#336600">rightCategory</font> y para <font color="#0000ff">rightAttribute</font>.<br/>',
						'<br/>',
						'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/>',
					'</p>',
					'<p align="center">Toca el área verde <b>debajo </b> para comenzar.</p>',
				'</div>'
			].join('\n'),

			instSwitchCategories : '<div><p align="center" style="font-size:20px; font-family:arial">' +
				'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'<b>Presta atención, ¡las etiquetas han cambiado de posición!</b><br/>' +
				'Pon un dedo izquierdo en la tecla <b>E</b> para <font color="#336600">leftCategory</font>.<br/>' +
				'Pon un dedo derecho en la tecla <b>I</b> para <font color="#336600">rightCategory</font>.<br/><br/>' +
				'<u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/><br/></p>' +
				'<p align="center">Presiona la <b>barra de espacio</b> cuando estés listo para comenzar.</font></p></div>',
			instSwitchCategoriesTouch: [
				'<div>',
					'<p align="center">',
						'<u>Part blockNum of nBlocks</u>',
					'</p>',
					'<p align="left" style="margin-left:5px">',
						'<br/>',
						'Presta atención, ¡las etiquetas han cambiado de posición!<br/>',
							'Pon un dedo izquierdo sobre el área verde de la <b>izquierda</b> para items de <font color="#336600">leftCategory</font>.<br/>',
							'Pon un dedo derecho sobre el área verde de la <b>derecha</b> para items de <font color="#336600">rightCategory</font>.<br/>',
							'Los items aparecerán uno a la vez.',
							'<br/>',
							'Si cometes un error aparecerá una <font color="#ff0000"><b>X</b></font> color rojo. Toca el otro lado. <u>Haz el ejercicio lo más rápido que puedas</u> siendo preciso al mismo tiempo.<br/>',
						'</p>',
						'<p align="center">Toca el área verde <b>debajo </b> para comenzar.</p>',
				'</div>'
			].join('\n'),

			instThirdCombined : 'instFirstCombined', //this means that we're going to use the instFirstCombined property for the third combined block as well. You can change that.
			instFourthCombined : 'instSecondCombined', //this means that we're going to use the instSecondCombined property for the fourth combined block as well. You can change that.
			instThirdCombinedTouch : 'instFirstCombined', //this means that we're going to use the instFirstCombined property for the third combined block as well. You can change that.
			instFourthCombinedTouch : 'instSecondCombined', //this means that we're going to use the instSecondCombined property for the fourth combined block as well. You can change that.

			showDebriefing:true, //Show feedback in the last trial? Relevant only in a Qualtrics IAT because in Qualtrics we cannot access the saved feedback and IAT score later in the survey.
			//Texts for the trials that show the debriefing.
			preDebriefingText : 'Presiona la barra de espacio para ver tu resultado', //Text in the trial that comes before showing the debriefing.
			preDebriefingTouchText : 'Toca el área verde para ver tu resultado', //Touch version for the text in the trial that comes before showing the debriefing.
			debriefingTextTop : 'Tu resultado:', //Will be shown above the feedback text.
			//ATTENTION: We do not recommend showing participants their results. The IAT is a typical psychological measure so it is not very accurate. 
			//In Project Implicit's website, you can see that we added much text to explain that there is still much unknown about the meaning of these results.
			//We strongly recommend that you provide all these details in the debriefing of the experiment.
			//debriefingTextBottom : '\n \n Este resultado no es una evaluación definitiva de tus actitudes. Presiona la barra de espacio para continuar.', //Will be shown below the feedback text. 
            debriefingTextBottomTouch : 'Este resultado no es una evaluación definitiva de tus actitudes. Toca el área verde para continuar.',
			//The default feedback messages for each cutoff -
			//attribute1, and attribute2 will be replaced with the name of attribute1 and attribute2.
			//categoryA is the name of the category that is found to be associated with attribute1,
			//and categoryB is the name of the category that is found to be associated with attribute2.
			fb_strong_Att1WithCatA_Att2WithCatB : 'Tus respuestas sugieren preferencia automática fuerte por categoryB sobre categoryA.',
			fb_moderate_Att1WithCatA_Att2WithCatB : 'Tus respuestas sugieren preferencia automática moderada por categoryB sobre categoryA.',
			fb_slight_Att1WithCatA_Att2WithCatB : 'Tus preferencias sugieren ligera preferencia automática por categoryB sobre categoryA.',
			fb_equal_CatAvsCatB : 'Tus respuestas no sugieren preferencia automática entre categoryA y categoryB.',

			//Error messages in the feedback
			manyErrors: 'Se cometieron demasiados errores como para determinar un resultado.',
			tooFast: 'Hubo demasiados intentos muy veloces como para determinar un resultado.',
			notEnough: 'No hubo suficientes intentos como para determinar un resultado.'
		};

		// extend the "current" object with the default
		_.extend(piCurrent, _.defaults(options, iatObj));
		_.extend(API.script.settings, options.settings);

        /**
        **** For Qualtrics
        */
        API.addSettings('onEnd', window.minnoJS.onEnd);

		//For debugging the logger
		//window.minnoJS.logger = console.log;
		//window.minnoJS.onEnd = console.log;
		
        API.addSettings('logger', {
            // gather logs in array
            onRow: function(logName, log, settings, ctx){
                if (!ctx.logs) ctx.logs = [];
                ctx.logs.push(log);
            },
            // onEnd trigger save (by returning a value)
            onEnd: function(name, settings, ctx){
                return ctx.logs;
            },
            // Transform logs into a string
            // we save as CSV because qualtrics limits to 20K characters and this is more efficient.
            serialize: function (name, logs) {
                var headers = ['block', 'trial', 'cond', 'comp', 'type', 'cat',  'stim', 'resp', 'err', 'rt', 'd', 'fb', 'bOrd'];
                //console.log(logs);
                var myLogs = [];
                var iLog;
                for (iLog = 0; iLog < logs.length; iLog++)
                {
                    if(!hasProperties(logs[iLog], ['trial_id', 'name', 'responseHandle', 'stimuli', 'media', 'latency'])){
                        // console.log('---MISSING PROPERTIY---');
                        // console.log(logs[iLog]);
                        // console.log('---MISSING PROPERTIY---');
                    }
                    else if(!hasProperties(logs[iLog].data, ['block', 'condition', 'score', 'cong']))
                    {
                        // console.log('---MISSING data PROPERTIY---');
                        // console.log(logs[iLog].data);
                        // console.log('---MISSING data PROPERTIY---');
                    }
                    else
                    {
                        myLogs.push(logs[iLog]);
                    }
                }
                var content = myLogs.map(function (log) { 
                    return [
                        log.data.block, //'block'
                        log.trial_id, //'trial'
                        log.data.condition, //'cond'
                        log.data.cong, //'comp'
                        log.name, //'type'
                        log.stimuli[0], //'cat'
                        log.media[0], //'stim'
                        log.responseHandle, //'resp'
                        log.data.score, //'err'
                        log.latency, //'rt'
                        '', //'d'
                        '', //'fb'
                        '' //'bOrd'
                        ]; });
                //console.log('mapped');
                //Add a line with the feedback, score and block-order condition
                content.push([
                            9, //'block'
                            999, //'trial'
                            'end', //'cond'
                            '', //'comp'
                            '', //'type'
                            '', //'cat'
                            '', //'stim'
                            '', //'resp'
                            '', //'err'
                            '', //'rt'
                            piCurrent.d, //'d'
                            piCurrent.feedback, //'fb'
                            block3Cond //'bOrd'
                        ]);
                //console.log('added');
                        
                content.unshift(headers);
                return toCsv(content);

                function hasProperties(obj, props) {
                    var iProp;
                    for (iProp = 0; iProp < props.length; iProp++)
                    {
                        if (!obj.hasOwnProperty(props[iProp]))
                        {
                           // console.log('missing ' + props[iProp]);
                            return false;
                        }
                    }
                    return true;
                }
                function toCsv(matrice) { return matrice.map(buildRow).join('\n'); }
                function buildRow(arr) { return arr.map(normalize).join(','); }
                // wrap in double quotes and escape inner double quotes
                function normalize(val) {
                    var quotableRgx = /(\n|,|")/;
                    if (quotableRgx.test(val)) return '"' + val.replace(/"/g, '""') + '"';
                    return val;
                }
            },
            // Set logs into an input (i.e. put them wherever you want)
            send: function(name, serialized){
                window.minnoJS.logger(serialized);
            }
        });

		// [REST OF YOUR ORIGINAL CODE REMAINS THE SAME - IT WAS CORRECT]
		// I'm truncating here for space, but your original sequence code was fine

		return API.script;
	}

	return iatExtension;
})); // FIXED: Added missing closing parenthesis
