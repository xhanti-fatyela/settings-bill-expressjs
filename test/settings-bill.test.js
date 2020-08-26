let assert = require('assert');

let settingsBill = require('../settings-bill');

let x = settingsBill()

const { settings } = require('cluster');

describe('settings-bill', function () {

    it('should be able to record call', function () {

        x.recordAction('call');
        x.recordAction('call');

        assert.equal(2, x.actionsFor('call').length)

    });

    it('should be able to set call & sms value', function () {

        x.setSettings({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 30,
            criticalLevel: 50
        });


        assert.deepEqual({
            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 30,
            criticalLevel: 50
        }, x.getSettings());

    });

    it('should be able to calculate the right totals', function () {

        const billWithSettings = settingsBill();

        billWithSettings.setSettings({

            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 30,
            criticalLevel: 50

        });

        billWithSettings.recordAction('call')
        billWithSettings.recordAction('sms')

        assert.equal(2.50, billWithSettings.totals().smsTotal)
        assert.equal(5.00, billWithSettings.totals().callTotal)
        assert.equal(7.50, billWithSettings.totals().grandTotal)

    });

    it('should calculate the right totals for multiple actions', function () {

        const billWithSettings = settingsBill();

        billWithSettings.setSettings({

            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 30,
            criticalLevel: 50

        });

        billWithSettings.recordAction('call')
        billWithSettings.recordAction('call')
        billWithSettings.recordAction('sms')
        billWithSettings.recordAction('sms')

        assert.equal(5.00, billWithSettings.totals().smsTotal)
        assert.equal(10.00, billWithSettings.totals().callTotal)
        assert.equal(15.00, billWithSettings.totals().grandTotal)

    });

    it('should able be able to know when warning level is reached', function () {

        const billWithSettings = settingsBill();

        billWithSettings.setSettings({

            smsCost: 2.50,
            callCost: 2.50,
            warningLevel: 5,
            criticalLevel: 10

        });

        billWithSettings.recordAction('call')
        billWithSettings.recordAction('sms')


        assert.equal(true, billWithSettings.hasReachedWarningLevel())

    });

    it('should be able to know when critical level has been reached', function () {

        const billWithSettings = settingsBill();

        billWithSettings.setSettings({

            smsCost: 2.50,
            callCost: 5.00,
            warningLevel: 5,
            criticalLevel: 10

        });

        billWithSettings.recordAction('call')
        billWithSettings.recordAction('call')
        billWithSettings.recordAction('sms')


        assert.equal(true, billWithSettings.hasReachedCriticalLevel())
    });


});