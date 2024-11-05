import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';
const Fleet = require('../src/models/fleet');
const FleetManager = require('../src/controllers/fleetManager');

chai.use(sinonChai);

describe('FleetManager Class', () => {
    let fleetManager;

    beforeEach(() => {
        fleetManager = new FleetManager();
    });

    afterEach(() => {
        sinon.restore(); // Restore sinon after each test to avoid state conflicts
    });

    describe('listFleets', () => {
        it('should list all fleets with associated ships', async () => {
            const fakeFleets = [
                {
                    id: 1,
                    name: 'Alpha Fleet',
                    ships: [{ id: 101, name: 'Warship 1' }],
                },
                {
                    id: 2,
                    name: 'Beta Fleet',
                    ships: [{ id: 102, name: 'Warship 2' }],
                },
            ];

            sinon.stub(Fleet, 'findAll').resolves(fakeFleets);

            const result = await fleetManager.listFleets();

            expect(Fleet.findAll).to.have.been.calledOnce;
            expect(result).to.deep.equal(fakeFleets);
        });

        it('should throw an error if listing fleets fails', async () => {
            sinon.stub(Fleet, 'findAll').throws(new Error('Database error'));

            try {
                await fleetManager.listFleets();
            } catch (error) {
                expect(error.message).to.equal('Unable to fetch fleet list.');
            }

            expect(Fleet.findAll).to.have.been.calledOnce;
        });
    });

    describe('fetchFleet', () => {
        it('should fetch a specific fleet by ID with associated ships', async () => {
            const fakeFleet = {
                id: 1,
                name: 'Alpha Fleet',
                ships: [{ id: 101, name: 'Warship 1' }],
            };
            sinon.stub(Fleet, 'findByPk').resolves(fakeFleet);

            const result = await fleetManager.fetchFleet(1);

            expect(Fleet.findByPk).to.have.been.calledOnceWith(1, {
                include: ['ships'],
            });
            expect(result).to.deep.equal(fakeFleet);
        });

        it('should throw an error if the fleet is not found', async () => {
            sinon.stub(Fleet, 'findByPk').resolves(null);

            try {
                await fleetManager.fetchFleet(999);
            } catch (error) {
                expect(error.message).to.equal('Fleet with ID 999 not found.');
            }

            expect(Fleet.findByPk).to.have.been.calledOnceWith(999, {
                include: ['ships'],
            });
        });
    });

    describe('createFleet', () => {
        it('should create a new fleet with a unique codeId', async () => {
            const fakeFleet = {
                id: 1,
                codeId: '1234',
                name: 'New Fleet',
                general: 'General Name',
                maxCapacity: 10,
            };

            sinon.stub(fleetManager, 'uniqueCodeIdGenerator').resolves('1234');
            sinon.stub(Fleet, 'create').resolves(fakeFleet);

            const result = await fleetManager.createFleet({
                name: 'New Fleet',
                general: 'General Name',
                maxCapacity: 10,
            });

            expect(fleetManager.uniqueCodeIdGenerator).to.have.been.calledOnce;
            expect(Fleet.create).to.have.been.calledOnceWith({
                codeId: '1234',
                name: 'New Fleet',
                general: 'General Name',
                maxCapacity: 10,
            });
            expect(result).to.deep.equal(fakeFleet);
        });

        it('should throw an error if fleet creation fails', async () => {
            sinon.stub(fleetManager, 'uniqueCodeIdGenerator').resolves('1234');
            sinon.stub(Fleet, 'create').throws(new Error('Database error'));

            try {
                await fleetManager.createFleet({
                    name: 'New Fleet',
                    general: 'General Name',
                    maxCapacity: 10,
                });
            } catch (error) {
                expect(error.message).to.equal('Failed to create fleet.');
            }

            expect(fleetManager.uniqueCodeIdGenerator).to.have.been.calledOnce;
            expect(Fleet.create).to.have.been.calledOnce;
        });
    });

    describe('updateFleet', () => {
        it('should update a fleet with new data', async () => {
            const fakeFleet = {
                id: 1,
                name: 'Alpha Fleet',
                update: sinon.stub().resolves(),
            };
            sinon.stub(Fleet, 'findByPk').resolves(fakeFleet);

            const updatedData = { name: 'Updated Fleet' };
            const result = await fleetManager.updateFleet(1, updatedData);

            expect(Fleet.findByPk).to.have.been.calledOnceWith(1);
            expect(fakeFleet.update).to.have.been.calledOnceWith(updatedData);
            expect(result).to.equal(fakeFleet);
        });

        it('should throw an error if the fleet is not found', async () => {
            sinon.stub(Fleet, 'findByPk').resolves(null);

            try {
                await fleetManager.updateFleet(999, { name: 'Updated Fleet' });
            } catch (error) {
                expect(error.message).to.equal('Fleet with ID 999 not found.');
            }

            expect(Fleet.findByPk).to.have.been.calledOnceWith(999);
        });

        it('should throw an error if fleet update fails', async () => {
            const fakeFleet = {
                id: 1,
                name: 'Alpha Fleet',
                update: sinon.stub().throws(new Error('Update error')),
            };
            sinon.stub(Fleet, 'findByPk').resolves(fakeFleet);

            try {
                await fleetManager.updateFleet(1, { name: 'Updated Fleet' });
            } catch (error) {
                expect(error.message).to.equal('Failed to update fleet.');
            }

            expect(Fleet.findByPk).to.have.been.calledOnceWith(1);
            expect(fakeFleet.update).to.have.been.calledOnce;
        });
    });

    describe('deleteFleet', () => {
        it('should delete a fleet by ID', async () => {
            const fakeFleet = { id: 1, destroy: sinon.stub().resolves() };
            sinon.stub(Fleet, 'findByPk').resolves(fakeFleet);

            const result = await fleetManager.deleteFleet(1);

            expect(Fleet.findByPk).to.have.been.calledOnceWith(1);
            expect(fakeFleet.destroy).to.have.been.calledOnce;
            expect(result.message).to.equal('Fleet 1 deleted.');
        });

        it('should throw an error if the fleet is not found', async () => {
            sinon.stub(Fleet, 'findByPk').resolves(null);

            try {
                await fleetManager.deleteFleet(999);
            } catch (error) {
                expect(error.message).to.equal('Fleet with ID 999 not found.');
            }

            expect(Fleet.findByPk).to.have.been.calledOnceWith(999);
        });

        it('should throw an error if fleet deletion fails', async () => {
            const fakeFleet = {
                id: 1,
                destroy: sinon.stub().throws(new Error('Delete error')),
            };
            sinon.stub(Fleet, 'findByPk').resolves(fakeFleet);

            try {
                await fleetManager.deleteFleet(1);
            } catch (error) {
                expect(error.message).to.equal('Failed to delete fleet.');
            }

            expect(Fleet.findByPk).to.have.been.calledOnceWith(1);
            expect(fakeFleet.destroy).to.have.been.calledOnce;
        });
    });

    describe('uniqueCodeIdGenerator', () => {
        it('should generate a unique codeId for a fleet', async () => {
            sinon.stub(Fleet, 'findOne').resolves(null); // Simulate no duplicate found

            const codeId = await fleetManager.uniqueCodeIdGenerator();

            expect(Fleet.findOne).to.have.been.calledOnce;
            expect(codeId).to.be.a('string').with.lengthOf(4);
        });

        it('should regenerate a codeId if a duplicate is found', async () => {
            const findOneStub = sinon.stub(Fleet, 'findOne');
            findOneStub.onFirstCall().resolves({ id: 1 }); // Simulate a duplicate
            findOneStub.onSecondCall().resolves(null); // No duplicate on second call

            const codeId = await fleetManager.uniqueCodeIdGenerator();

            expect(Fleet.findOne).to.have.been.calledTwice;
            expect(codeId).to.be.a('string').with.lengthOf(4);
        });
    });
});
