/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Jann Paolo Caña
		Copyright (c) 2014 Richeve Siodina Bebedor
		Copyright (c) 2014 Regynald Reiner Ventura

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "burrow-app/task for 08-06-2014",
			"fileName": "update-value.js",
			"moduleName": "updateValue",
			"authorName": "Jann Paolo Caña",
			"authorEMail": "paolo.garcia00@yahoo.com",
			"contributorList": [
				{
					"contributorName": "Richeve Siodina Bebedor",
					"contributorEMail": "richeve.bebedor@gmail.com"
				},
				{
					"contributorName": "Regynald Reiner Ventura",
					"contributorEMail": "regynaldventura@gmail.com"					
				}
			],
			"repository": "git@github.com:volkovasystems/burrow-app.git",
			"testCase": "update-value-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:
		Update the value using 	the specified condition with the following format:

			schema@key=value

		If no schema is specified then we will assume that the collectionName == schema.
	@end-module-documentation

	@include:
		{			
			"mongoose@npm": "mongoose",
			"resolve-query-condition@github.com/volkovasystems": "resolveQueryCondition"
		}
	@end-include
*/

var updateValue = function updateValue( condition, value, collectionName, databaseName, databaseHost, databasePort, callback ){
	/*:
		@meta-configuration:
			{
				"condition:required": "object",
				"value:required": "string",
				"collectionName:required": "string",
				"databaseName:required": "string",
				"databaseHost:required": "string",
				"databasePort:required": "number",
				"callback:optional": "function"
			}
		@end-meta-configuration
	*/

		var queryCondition = resolveQueryCondition( condition );
		var dataSchema = queryCondition.reference;
		var queryObject = queryCondition.queryObject;

	//NOOP override.
	callback = callback || function( ){ };

	var mongoDatabaseURL = [ 
		"mongodb://",
		databaseHost, ":",
		databasePort, "/",
		databaseName 
	].join( "" );

	var connection = mongoose.createConnection( mongoDatabaseURL );

	connection.on( "connected",
		function onConnected( ){
			//Check if we have the model in the list of models.
			if( connection.modelNames( ).indexOf( dataSchema ) != -1 ){
				var dataModel = mongoose.model( dataSchema, collectionName );

				dataModel.findOneAndUpdate( queryObject, value,
					function onUpdate( error ){
						mongoose.connection.close( );

						if( error ){
							console.error( error );
							callback ( error );

						}else{
							console.log( true );
							callback( null, true );
						}
					} );
			}else{
				var error = new Error( "invalid schema" );
				console.error( error );
				callback( error );
			}
		} );

	connection.on( "error",
		function onError( error ){
			console.error( error );

			callback( error );
		} );
};

var mongoose = require( "mongoose" );
var resolveQueryCondition = require( "./resolve-query-condition/resolve-query-condition.js" );

module.exports = updateValue;