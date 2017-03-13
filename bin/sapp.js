#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var ncp = require('ncp');
var mootools = require('mootools');
var child = require('child_process');

var thisDir = path.dirname(module.filename) + '/';

function unDos(filepath)
{
	filepath = path.resolve(filepath);

/*	if (filepath.indexOf(':') == 1)
	{
		filepath = filepath.slice(2);
	}
*/
	filepath = filepath.replace(/\\/g, '/');
	return filepath;
}

thisDir = unDos(thisDir) + '/';
var params = argv._;
console.log(params);
function outputInstructions()
{
	var instructions = fs.readFileSync(thisDir + 'instructions.txt', {encoding:'ascii'});
	console.log(instructions);
};

var commands = ['install', 'page', 'dialog', 'feature', 'service', 'controller', 'module'];

if (params.length == 0) return outputInstructions();
if (commands.indexOf(params[0]) == -1) return outputInstructions();

switch (params[0])
{
	case 'install':
		if (params.length != 1) return outputInstructions()
		break;
	case 'controller':
		if (params.length != 2) return outputInstructions()
		break;
	case 'module':
		if (params.length < 2 || params.length > 3) return outputInstructions();
		break;
	case 'service':
		if (params.length != 4) return outputInstructions();
		break;
	case 'page':
	case 'dialog':
	case 'feature':
	case 'service':
		if (params.length < 3 || params.length > 4) return outputInstructions();
		break;
}

function replaceNames(text, names)
{
	Object.each(names, function(value, name)
	{
		var regEx = new RegExp('\{' + name + '\}', 'g');
		text = text.replace(regEx, value);
	});

	return text;
}

function processOne(folder, spec, names)
{
	var fullPath = unDos(fs.realpathSync('./') + '/' + spec.path);
	var justPath = path.dirname(fullPath);
	var templateFile = thisDir + folder + '/templates/' + spec.template;


	mkdirp.sync(justPath);

// do not overwrite existing files
	if (fs.existsSync(fullPath)) return;

	template = fs.readFileSync(templateFile, {encoding: 'utf-8'});
	template = replaceNames(template, names);

	fs.writeFileSync(fullPath, template);
}

function processManifest(folder, names)
{
	var manifestFile = thisDir + folder + '/manifest.js';
	var manifest = require(manifestFile);

	manifest.files.each(function(spec)
	{
		spec.path = replaceNames(spec.path, names);
		processOne(folder, spec, names);
	});
}

function getNames(params, defaultName)
{
	var app = params[1];
	var name = params[2];
	var list = params[3];

	var result = {}
	result.App = app.replace(/-/g, ' ').capitalize().replace(/ /g, '')
	result.aPp = app.camelCase(app.replace(/-/g, ' '));
	result.APP = app.toUpperCase().replace(/-/g, '_');;
	result.app = app;
	result.list = list;

	if (!name && defaultName) name = app;
	if (name)
	{
		result.Name = name.replace(/-/g, ' ').capitalize().replace(/ /g, '')
		result.nAme = name.camelCase().replace(/-/g, ' ');
		result.NAME = name.toUpperCase().replace(/-/g, '_');
		result.name = name;
	}

	return result;
}

function getPath(params, which)
{
	var path = (params.length > which)?'':params[1];
	if (params.length != which + 1) return path;
	path += '/' + params[which];

	return path;
}

function makeInstall()
{
	var destination = process.cwd();
	var source = thisDir;

	ncp(source + '../lib/files', destination, function()
	{
	});
}

switch (params[0])
{
	case 'install':
		makeInstall();
		var names = {}
		names.cwd = process.cwd();
		names.path = getPath(params, 2);
		processManifest('install', names);
		console.log('installing dependencies...');
		child.execSync('npm install');

		break;

	case 'controller':
		if (params.length === 2) params.push(params[1]);
		var names = getNames(params);
		names.cwd = process.cwd();
		names.path = getPath(params, 2);
		processManifest('controller', names);
		break;

	case 'module':
		if (params.length === 2) params.push(params[1] + '-module');
		var names = getNames(params);
		names.cwd = process.cwd();
		names.path = getPath(params, 2);
		processManifest('module', names);


	case 'page':
		var names = getNames(params);
		names.path = getPath(params, 3);
		processManifest('page', names);
		break;

	case 'dialog':
		var names = getNames(params);
		names.path = getPath(params, 3);
		processManifest('dialog', names);
		break;

	case 'feature':
		var names = getNames(params);
		names.path = getPath(params, 3);
		processManifest('feature', names);
		break;

	case 'service':
		var names = getNames(params);
		names.path = names.app;
		processManifest('service', names);
		console.log('');
		console.log('Be sure to add ", \'assets/js/Services/' + names.Name + '.js\'"\nto /features/services/services.js');
		break;
}
