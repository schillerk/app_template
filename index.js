const express = require('express');
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const uuidv1 = require('uuid/v1');

var fs = require('fs');

const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SSL
// var options = {
//   key: fs.readFileSync(path.resolve('./server.key')),
//   cert: fs.readFileSync(path.resolve('./server.crt'))
// };

// Code to initialize and populate database
var db = new sqlite3.Database('./database.db');
db.serialize(function() {
	// db.run(`CREATE TABLE posts (
	// 	post_id TEXT PRIMARY_KEY,
	// 	name TEXT,
	// 	description TEXT,
	// 	link TEXT
	// )`);
	// db.run(`CREATE TABLE authors (
	// 	name TEXT,
	// 	post_id INTEGER,
	// 		FOREIGN KEY (post_id) REFERENCES posts(post_id)
	// )`);
	// db.run(`CREATE TABLE tags (
	// 	name TEXT NOT NULL,
	// 	post_id INTEGER,
	// 		FOREIGN KEY (post_id) REFERENCES posts(post_id)
	// )`);
	// db.run(`CREATE TABLE users (
	// 	name TEXT NOT NULL,
	// 	id INTEGER,
	// 	email TEXT
	// )`);
	// db.run("CREATE TABLE ideas (label TEXT, tags TEXT)");

	// const query = `INSERT INTO posts VALUES(?, ?, ?)`;
	// const arr = ['weffe', 'bzb', 'pl'];
	// db.run(query, arr);
	// db.run(query, 'Example Title 2', 'Example Authors', 'Example Tags', 'Example Description');
	// db.run(query, 'Guest Analysis 1', 'Sally Smart__,__Wesley Wisdom', 'Machine Learning__,__Customer Experience', 'Using state of the art Machine Learning techinques we learn guest clusters based on an hand-curated interpretable feature set to to algorithmically generate user personas for the first time.');
	// db.run(query, 'Guest Analysis 2', 'Tommy Tester__,__Wesley Wisdom', 'Data Science__,__Customer Experience', 'Using state of the art Machine Learning techinques we learn guest clusters based on an hand-curated interpretable feature set to to algorithmically generate user personas for the second time.');
	// db.run(query, 'Guest Analysis 3', 'Sally Smart__,__Anna Applied Mathematics', 'Data Science__,__Customer Experience__,__User Engagement', 'Using state of the art Machine Learning techinques we learn guest clusters based on an hand-curated interpretable feature set to to algorithmically generate user personas for the third time.');
	// db.run(query, 'Guest Analysis 4', 'Cathy Coder__,Tommy Tester', 'Machine Learning__,__Design', 'Using state of the art Machine Learning techinques we learn guest clusters based on an hand-curated interpretable feature set to to algorithmically generate user personas for the fourth time.');
	// db.run(query, 'Guest Analysis 5', 'Cathy Coder__,__Sally Smart', 'Product', 'Using state of the art Machine Learning techinques we learn guest clusters based on an hand-curated interpretable feature set to to algorithmically generate user personas for the fifth time.');
	// db.each(`SELECT rowid as id, title, tags FROM posts`, function(err, row) {
		// console.log(row);
		// console.log(row.id, row.title, row.authors, row.tags, row.description);
	// });
	db.each(`SELECT post_id, name, description, link FROM posts`, function(err, row) {
		console.log(row);
	});

	db.each(`SELECT name, post_id FROM authors`, function(err, row) {
		console.log(row);
	});

	db.each(`SELECT name, post_id FROM tags`, function(err, row) {
		console.log(row);
	});

	db.each(`SELECT name FROM users`, function(err, row) {
		console.log(row);
	});


// 	db.run("CREATE TABLE ideas (label TEXT, tags TEXT)");
// 	const query = `INSERT INTO tags VALUES(?, ?)`;
// 	db.each(`SELECT rowid as id, label FROM tags`, function(err, row) {
// 		console.log(row.id, row.label);
// 	});
	db.close();
});

const splitString = '__,__';
function parseArr(arr) {
	return arr.reduce((acc, el) =>
		acc += el + splitString, '').slice(0, -splitString.length);
}

function runQuery(query, data) {
	const db = new sqlite3.Database('./database.db');

	db.run(query, data, (err, rows) => {
	  if (err) { throw err }
	  console.log(query);
	});

	db.close();
}

app.post('/api/createUser', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	const { name, id, email } = req.body;

	const data = [name, id, email];
	console.log(data);
	const query = 'INSERT INTO users VALUES(?, ?, ?)';

	db.run(query, data, (err, user) => {
	  if (err) { throw err }
	  console.log('Create User Success');
	});

	db.close();
});

app.get('/api/getUser/:user_id', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	console.log(req.params.user_id);

	const query = `SELECT * FROM users WHERE id=${req.params.user_id}`;

	db.all(query, [], (err, rows) => {
	  if (err) { throw err }
	  res.json(rows[0]);
	  console.log('Select Success');
	});

	db.close();
});

app.post('/api/post', (req, res) => {
	var db = new sqlite3.Database('./database.db');
	const { name, description, link, authors, tags } = req.body;

	const post_id = uuidv1();
	const post_query = 'INSERT INTO posts VALUES(?, ?, ?, ?)'
	const post_data = [post_id, name, description, link];

	db.run(post_query, post_data, function(err, rows) {
	  if (err) { throw err }
	  console.log('Insert Post Success');
	});

	authors.forEach(author => {
		const author_query = 'INSERT INTO authors VALUES(?, ?)'
		const author_data = [author, post_id];
		db.run(author_query, author_data, function(err, rows) {
		  if (err) { throw err }
		  console.log('Insert Author Success');
		});		
	});

	tags.forEach(tag => {
		const tag_query = 'INSERT INTO tags VALUES(?, ?)'
		const tag_data = [tag, post_id];
		db.run(tag_query, tag_data, function(err, rows) {
		  if (err) { throw err }
		  console.log('Insert Tag Success');
		});		
	});

	db.close();
});

app.get('/api/fetchAllTags', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	const query = 'SELECT DISTINCT name from tags'

	db.all(query, [], (err, rows) => {
	  if (err) { throw err }
	  const out = rows.map(row => row.name);
	  res.json(out);
	  console.log('Select Success');
	});

	db.close();
});

app.get('/api/fetchAllAuthors', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	const query = 'SELECT DISTINCT name from authors'

	db.all(query, [], (err, rows) => {
	  if (err) { throw err }
	  const out = rows.map(row => row.name);
	  res.json(out);
	  console.log('Select Success');
	});

	db.close();
});


app.get('/api/fetchPost/:post_id', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	console.log(req.params);
	const { post_id } = req.params;

	const query = `
		SELECT 	posts.post_id,
						tags.name as tag_name,
						posts.name as post_name,
						authors.name as author_name,
						description,
						link
		FROM 		posts, authors, tags
		WHERE 	posts.post_id = '${post_id}'
			AND 	authors.post_id = '${post_id}'
			AND 	tags.post_id = '${post_id}'
	`;
		db.all(query, [], (err, rows) => {
	  if (err) { throw err }

	  const out = {};
	  rows.forEach(({post_id, post_name, description, link, tag_name, author_name}) => {
	  	if (!out.hasOwnProperty(post_id)) {
	  		out[post_id] = {
	  			post_id: post_id,
	  			name: post_name,
	  			description: description,
	  			link: link,
	  			tags: new Set([tag_name]),
	  			authors: new Set([author_name])
	  		};
	  	}
	  	else {
	  		out[post_id].tags.add(tag_name)
	  		out[post_id].authors.add(author_name)
	  	}
	  });

	  // Convert sets back into arrays
	  Object.keys(out).forEach(key => {
	  	out[key].tags = [...out[key].tags];
	  	out[key].authors = [...out[key].authors];
	  });

	  res.json(out);
	  console.log('Select Success');
	});

	// db.all(query, [], (err, rows) => {
	//   if (err) { throw err }
	//   res.json(rows[0]);
	//   console.log('Select Success');
	// });

	db.close();
});

app.get('/api/fetchAllPosts', (req, res) => {
	var db = new sqlite3.Database('./database.db');

	const query = `
		SELECT 	posts.post_id,
						tags.name as tag_name,
						posts.name as post_name,
						authors.name as author_name,
						description,
						link
		FROM 	posts, authors, tags
		WHERE	posts.post_id = authors.post_id
			AND posts.post_id = tags.post_id
	`;

	db.all(query, [], (err, rows) => {
	  if (err) { throw err }

	  const out = {};
	  rows.forEach(({post_id, post_name, description, link, tag_name, author_name}) => {
	  	if (!out.hasOwnProperty(post_id)) {
	  		out[post_id] = {
	  			post_id: post_id,
	  			name: post_name,
	  			description: description,
	  			link: link,
	  			tags: new Set([tag_name]),
	  			authors: new Set([author_name])
	  		};
	  	}
	  	else {
	  		out[post_id].tags.add(tag_name)
	  		out[post_id].authors.add(author_name)
	  	}
	  });

	  // Convert sets back into arrays
	  Object.keys(out).forEach(key => {
	  	out[key].tags = [...out[key].tags];
	  	out[key].authors = [...out[key].authors];
	  });

	  res.json(out);
	  console.log('Select Success');
	});

	db.close();
});

app.get('/api/delete/:obj', (req, res) => {
	const db = new sqlite3.Database('./database.db');
	
	const post_id = req.params.obj;

	db.run('DELETE FROM posts WHERE post_id = ?', post_id, (err, rows) => {
	  if (err) { throw err }
	});

	db.run('DELETE FROM authors WHERE post_id = ?', post_id, (err, rows) => {
	  if (err) { throw err }
	});

	db.run('DELETE FROM tags WHERE post_id = ?', post_id, (err, rows) => {
	  if (err) { throw err }
	});

	db.close();
});

// app.get('/api/delete/:obj', (req, res) => {
// 	const { rowid, type } = JSON.parse(req.params.obj);
// 	const data = rowid;
// 	const query = `DELETE FROM ${type}s WHERE rowid = ?`;

// 	runQuery(query, data);
// });

// app.get('/api/update/:obj', (req, res) => {
// 	const { label, rowid, type } = JSON.parse(req.params.obj);
// 	const data = [label, rowid];
// 	const query = `UPDATE ${type}s
// 	            	SET label = ?
// 	            	WHERE rowid = ?`;

// 	runQuery(query, data);
// });


// app.get('/api/update/ideaTags/:obj', (req, res) => {
// 	const { tags, rowid } = JSON.parse(req.params.obj);
// 	const data = [parseArr(tags), rowid];
// 	const query = `UPDATE ideas
// 	            	SET tags = ?
// 	            	WHERE rowid = ?`;

// 	runQuery(query, data);
// });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
