const { MongoClient } = require('mongodb');

const debug = require('debug')('gradesApp:gradesController');
const chalk = require('chalk');

const dbUrl =
  'mongodb+srv://drag:R42dRyQGD3gKURN@sauster.bhimc.mongodb.net/Sauster?retryWrites=true&w=majority';
const dbName = 'sample_training';
const collectionName = 'grades';

const findInDB = async (ids) => {
  const byClassId = Object.keys(ids).includes('classId');
  const byStudentId = Object.keys(ids).includes('studentId');
  let response = {};
  let client;
  try {
    client = await MongoClient.connect(dbUrl);
    debug(`${chalk.green('Connected')} to ${chalk.cyan('mongo DB')}`);
    const db = client.db(dbName);
    const grades = db.collection(collectionName);
    const { classId, studentId } = ids;
    const findBy = {};
    const returnedFields = {
      _id: 0,
      class_id: 1
    };
    if (byClassId) {
      findBy.class_id = Number(classId);
      returnedFields.student_id = 1;
      if (byStudentId) {
        findBy.student_id = Number(studentId);
        returnedFields.scores = 1;
      }
    }
    const student = grades.find(findBy).project(returnedFields);

    if (student) {
      const students = await student.toArray();
      response = {
        students
      };
    }
  } catch (error) {
    response.error = true;
    debug(`Could not ${chalk.red('connect')} to ${chalk.cyan('mongo DB')}`);
    debug(error);
  }
  client.close();
  debug(`Closed ${chalk.cyan('client')}`);
  return response;
};

const getStudents = async (req, res) => {
  const response = await findInDB(req.params);

  return res.json(response);
};

const getClasses = async (req, res) => {
  const response = await findInDB(req.params);

  const classes = [];
  response.students.forEach((student) => {
    if (!classes.includes(student.class_id)) classes.push(student.class_id);
  });

  classes.sort((a, b) => a - b);

  return res.json({ classes });
};

module.exports = {
  getStudents,
  getClasses
};
