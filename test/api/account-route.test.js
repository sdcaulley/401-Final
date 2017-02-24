const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const app = require('../../lib/app');
const request = chai.request(app);
const User = require('../../lib/models/user-schema');
const Token = require('../../lib/auth/token');

describe('account api', () => {
    let token = '';
    let listId = null;
    let userId1 = null;
    let listId2 = null;
    let account1 = {};

    before(() => {

        return User.findOne({ name: 'me' })
            .then(user => {
                userId1 = user._id;
                return Token.sign(user.id);
            })
            .then(data => {
                return token = data;
            });
    });

    let testList = {
        name: 'testList',
        item: []
    };

    let testList2 = {
        name: 'list2',
        item: []
    };

    before(() => {
        return saveResource(testList, '/lists')
            .then(list => {
                return listId = list._id;
            });
    });

    before(() => {
        return saveResource(testList2, '/lists')
            .then(list => {
                return listId2 = list._id;
            });
    });

    function saveResource(resource, route) {
        return request.post(route)
            .set('Authorization', token)
            .send(resource)
            .then(res => res.body);
    }

    it('create a new account', () => {

        let accountOne = {
            accType: 'individual',
            members: [{ user: userId1, role: 'owner' }],
            list: [listId]
        };

        return saveResource(accountOne, '/accounts')
            .then(savedAccount => {
                assert.isOk(savedAccount._id);
                accountOne._id = savedAccount._id;
                accountOne.__v = 0;
                account1 = accountOne;
                //mocha is interpretting _id as a buffer
                assert.equal(savedAccount.accType, accountOne.accType);
            });
    });

    it('add a new user to account', () => {
        return User.findOne({ name: 'you' })
            .then(data => {
                request.post(`/accounts/${account1._id}/addmember`)
                    .set('Authorization', token)
                    .send({ user: data._id, role: 'viewer' })
                    .then(res => {
                        const results = res.body.members.filter(x => {
                            return x.user == data._id;
                        });
                        assert.equal(results[0].user, data._id);
                    });
            });
    });

    it('add a new list', () => {
        return request.post(`/accounts/${account1._id}/addnewlist`)
            .set('Authorization', token)
            .send({ list_id: listId2 })
            .then(res => {
                assert.include(res.body.list, listId2);
            });
    });

    it('get all accounts', () => {
        return request.get('/accounts')
            .set('Authorization', token)
            .then(res => {
                assert.isArray(res.body);
            });
    });

    it('get account by id', () => {
        return request.get(`/accounts/${account1._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.equal(res.body._id, account1._id);
            });
    });

    it('remove user from account', () => {
        return request.post(`/accounts/${account1._id}/removemember`)
            .set('Authorization', token)
            .send({ userId: userId1._id })
            .then(res => {
                const results = res.body.members.filter(x => {
                    if (x.user != userId1._id) {
                        return x;
                    }
                    assert.notInclude(results, userId1._id);
                });
            });
    });

    it('remove list from account', () => {
        return request.post(`/accounts/${account1._id}/removelist`)
            .set('Authorization', token)
            .send({ list_id: listId })
            .then(res => {
                assert.notInclude(res.body.list, listId);
            });
    });

    it('delete an account', () => {
        return request.delete(`/accounts/${account1._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(res.body, { deleted: true });
            });
    });
});