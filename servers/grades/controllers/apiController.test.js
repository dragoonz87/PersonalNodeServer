const { MongoClient } = require('mongodb');
const { makeResp } = require('../../../utils/testUtil');

const apiController = require('./apiController');

describe('API controller', () => {
  it('should send an error when it there is an error during connection', async () => {
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn(),
      close: jest.fn()
    };
    const connectionSpy = jest
      .spyOn(MongoClient, 'connect')
      .mockReturnValue(client);
    const req = {
      params: {
        classId: '0',
        studentId: '0'
      }
    };
    const resp = makeResp();

    await apiController.getStudents(req, resp);

    expect(connectionSpy).toHaveBeenCalled();
    expect(client.db).toHaveBeenCalled();
    expect(client.collection).toHaveBeenCalled();
    expect(resp.json).toHaveBeenCalled();
    expect(resp.data.error).toBeTruthy();
  });

  it('should send a student when everything works RENAME THIS TEST PLEASE PLEASE PLEASE', async () => {
    const studentData = {
      students: [
        {
          student_id: 0,
          scores: [
            {
              type: 'exam',
              score: 36.94007674736013
            },
            {
              type: 'quiz',
              score: 93.79157023682248
            },
            {
              type: 'homework',
              score: 6.790903996294617
            },
            {
              type: 'homework',
              score: 66.28741078282553
            }
          ],
          class_id: 0
        }
      ]
    };
    const projectedData = {
      toArray() {
        return studentData.students;
      }
    };
    const collection = {
      find: jest.fn().mockReturnThis(),
      project: jest.fn().mockReturnValue(projectedData)
    };
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnValue(collection),
      close: jest.fn()
    };
    const connectionSpy = jest
      .spyOn(MongoClient, 'connect')
      .mockReturnValue(client);

    const req = {
      params: {
        classId: '0',
        studentId: '0'
      }
    };
    const resp = makeResp();

    await apiController.getStudents(req, resp);

    expect(connectionSpy).toHaveBeenCalled();
    expect(client.db).toHaveBeenCalled();
    expect(client.collection).toHaveBeenCalled();
    expect(collection.find).toHaveBeenCalled();
    expect(collection.project).toHaveBeenCalled();
    expect(resp.json).toHaveBeenCalled();
    expect(resp.data).toEqual(studentData);
  });

  it('should send a list of classes when they are asked for?????????', async () => {
    const classes = { classes: [] };
    const students = [];

    for (let i = 0; i <= 5; i++) {
      classes.classes.push(`${i}`);
      students.push({ class_id: `${i}` });
    }

    const projectedData = {
      toArray() {
        return students;
      }
    };
    const collection = {
      find: jest.fn().mockReturnThis(),
      project: jest.fn().mockReturnValue(projectedData)
    };
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnValue(collection),
      close: jest.fn()
    };
    const connectionSpy = jest
      .spyOn(MongoClient, 'connect')
      .mockReturnValue(client);
    const req = {
      params: {}
    };
    const resp = makeResp();

    await apiController.getClasses(req, resp);

    expect(connectionSpy).toHaveBeenCalled();
    expect(client.db).toHaveBeenCalled();
    expect(client.collection).toHaveBeenCalled();
    expect(collection.find).toHaveBeenCalled();
    expect(collection.project).toHaveBeenCalled();
    expect(resp.json).toHaveBeenCalled();
    expect(resp.data).toEqual(classes);
  });
});
