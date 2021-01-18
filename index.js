class User {
    constructor(name, money) {
        if (money < 0) {
            throw new Error('money must be >=0');
        }
        this.name = name;
        this.money = money;
    };

    play(gameMachine, money) {
        if (money > this.money) {
            throw new Error('You don\'t have enough money');
        }
        if (money < 0) {
            throw new Error('You can play for >= 0');
        }
        try {
            this.money -= money;
            this.money += gameMachine.play(money);
        } catch (error) {
            this.money += money;
            throw error;
        }
    }
}

class SuperAdmin extends User {
    casino = null;

    createCasino(name) {
        if (this.casino) {
            throw new Error('You have casino');
        }
        this.casino = new Casino(name);
    }

    createMachine(money) {
        if (this.money < money) {
            throw new Error('You don\'t have enough money');
        }
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        this.money -= money;
        this.casino.createMachine(money);
    }

    withdrawMoneyFromCasino(money) {
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        this.casino.withdrawMoney(money);
        this.money += money;
    }

    addMoneyToCasino(machineNumber, money) {
        if (this.money < money) {
            throw new Error('You don\'t have enough money');
        }
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        this.casino.addMoneyToMachine(machineNumber, money);
        this.money -= money;
    }

    removeGameMachine(machineNumber) {
        this.casino.removeGameMachine(machineNumber);
    }

}

class GameMachine {
    constructor(money) {
        if (money < 0) {
            throw new Error('money must be >=0');
        }
        this.money = money;
    };

    get getMoney() {
        return this.money;
    };

    withdrawMoney(money) {
        if (money > this.money) {
            throw new Error('Game Machine doesn\'t have enough money');
        }
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        this.money -= money;
    };

    addMoney(money) {
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        this.money += money;
    };

    play(money) {
        if (this.money < money * 2) {
            throw new Error('Game Machine doesn\'t have enough money');
        }
        this.addMoney(money)
        const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        console.log('Game Machine result: ', number);
        const result = new Set(number.split('')).size;

        let prize = 0;
        if (result === 1) {
            prize = money * 3;
        }
        if (result === 2) {
            prize = money * 2;
        }
        this.withdrawMoney(prize);
        if (prize > 0) {
            console.log('you won: ', prize);
        } else {
            console.log('you lose: ', money);
        }
        return prize;
    };
};

class Casino {
    machines = [];

    constructor(name) {
        this.name = name;
    };

    get getMoney() {
        return this.machines.reduce((sum, machine) => sum + machine.getMoney, 0);
    }

    get getMachineCount() {
        return this.machines.length;
    }

    createMachine(money) {
        if (money < 0) {
            throw new Error('Money must be >= 0');
        }
        const machine = new GameMachine(money);
        this.machines.push(machine);
    }

    withdrawMoney(money) {
        if (this.getMoney < money) {
            throw new Error('Casino doesn\'t have enough money');
        }
        this.machines.sort((prevMachine, nextMachine) => prevMachine.getMoney < nextMachine.getMoney ? 1 : -1);
        let moneyWithdraw = money;
        for (const machine of this.machines) {
            if (machine.getMoney < moneyWithdraw) {
                moneyWithdraw -= machine.getMoney;
                machine.withdrawMoney(machine.getMoney);
            } else {
                machine.withdrawMoney(moneyWithdraw);
                break;
            }
        }
    };

    addMoneyToMachine(machineNumber, money) {
        if (!this.machines[machineNumber]) {
            throw new Error('Game Machine doesn\'t exist');
        }
        this.machines[machineNumber].addMoney(money);
    }

    removeGameMachine(machineNumber) {
        if (!this.machines[machineNumber]) {
            throw new Error('Game Machine doesn\'t exist');
        }
        const money = this.machines[machineNumber].getMoney;
        this.machines[machineNumber].withdrawMoney(money);
        this.machines.splice(machineNumber, 1);
        this.machines.forEach((machine) => {
            machine.addMoney(money / this.machines.length);
        })
    }
}