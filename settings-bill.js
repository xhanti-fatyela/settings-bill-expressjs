module.exports = function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;

    let actionList = [];

    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;


    }

    function getSettings() {

        return {

            smsCost,
            callCost,
            warningLevel,
            criticalLevel


        }


    }

    function recordAction(action) {

        

     if(!hasReachedCriticalLevel()){
         
        let cost = 0;

        if (action === "sms") {

            cost = smsCost;

        }

    
         if (action === "call") {

            cost = callCost;

        }
    
     

        actionList.push({
            type: action,
            cost,
            timestamp: new Date()

        });


     }
}

    function actions() {
        return actionList;
    }

    function actionsFor(type) {

        return actionList.filter((action) => action.type === type)

    }

    function getTotal(type) {

        return actionList.reduce((total, action) => {

            let val = action.type === type ? action.cost : 0;
            return total + val;

        }, 0);
    }

    function grandTotal() {
        return getTotal("sms") + getTotal("call")


    }

    function totals() {
        let smsTotal = getTotal("sms").toFixed(2)
        let callTotal = getTotal("call").toFixed(2)

        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal().toFixed(2),
            color: colorDisplay()


        }
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel

        return reachedWarningLevel
    }


    function hasReachedCriticalLevel() {

        const total = grandTotal();
        return total >= criticalLevel
    }

    function colorDisplay() {
        if (hasReachedCriticalLevel()) {

            return "danger"

        }
        else if (hasReachedWarningLevel()) {

            return "warning"

        }

    }



    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel,
        getTotal,
        colorDisplay,

    }
}


