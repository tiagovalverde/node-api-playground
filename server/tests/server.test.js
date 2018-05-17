let expect = require('expect');
let request = require('supertest');

//local files (server, todo model)
let {app} = require('./../server');
let {Todo} = require('./../models/todo');

beforeEach((done) => {
    // wipe out all todos
    Todo.remove({}).then(() => done());
})


describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    })

    it('Should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400) // test http status
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                // test not changes in mongo
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })  
    });
});
