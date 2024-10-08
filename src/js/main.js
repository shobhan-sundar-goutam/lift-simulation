let numberOfLifts = 0
let numberOfFloors = 0
let lifts = []
let floorsQueue = []
let intervalId

const inputLift = document.querySelector('input[name="lift"]');
inputLift.addEventListener('change', () => numberOfLifts = inputLift.value ? parseInt(inputLift.value) : 0)

const inputFloor = document.querySelector('input[name="floor"]');
inputFloor.addEventListener('change', () => numberOfFloors = inputFloor.value ? parseInt(inputFloor.value) : 0)

const submitBtn = document.getElementById('submit');
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if (numberOfLifts <= 0 || numberOfFloors <= 0) return alert('Lifts and Floors must be numeric with values atleast 1')
    // if (numberOfFloors <= numberOfLifts) return alert('Number of Lifts must be less than number of Floors')
    
    lifts = []
    floorsQueue = []
    clearInterval(intervalId)

    generateBuilding(numberOfLifts, numberOfFloors)   

    intervalId = setInterval(() => {
        if (floorsQueue.length > 0) {
            let floor = floorsQueue.shift()
            moveLift(floor)
        }
    }, 100);    
})

function generateBuilding(numberOfLifts, numberOfFloors) {    
    let generatedLifts = ''
    for (let i = 1; i <= numberOfLifts; i++) {
        generatedLifts += ` 
        <div id="lift${i}" class="lift">
            <div id="left-door${i}" class="door"></div>
            <div id="right-door${i}" class="door"></div>
        </div>
        `;

        lifts.push({liftId: `lift${i}`, isBusy: false, currentFloor: 1, movingDirection: null})
    }

    let generatedFloors = ''
    for (let i = numberOfFloors; i >= 1; i--) {
        generatedFloors += `
        <div class="floor">
            <div class="lift-labels">
                <span class="floor-label">Floor ${i}</span>
                <span class="lift-controls">
                    ${i !== numberOfFloors ? `<button class="lift-control up" onclick="floorsQueue.push({floorNumber: ${i}, buttonClicked: 'up'})">Up</button>`: ''}
                    ${i !== 1 ? `<button class="lift-control down" onclick="floorsQueue.push({floorNumber: ${i}, buttonClicked: 'down'})">Down</button>` : ''}
                </span>
            </div>
            ${i === 1 ? `<div class="lifts">${generatedLifts}</div>` : ''}
        </div>
        `;
    }    

    const building = document.getElementById('building');
    building.innerHTML = generatedFloors
}

function moveLift(floor) {
    const liftId = findLiftToBeMoved(floor);    

    if (!liftId) {
        floorsQueue.unshift(floor)
        return
    }

    const lift = lifts.find(lift => lift.liftId === liftId)
    
    if (!lift.isBusy) {
        const liftEl = document.getElementById(lift.liftId);
        
        const y = (floor.floorNumber - 1) * 90 * -1;
        const time = Math.abs(floor.floorNumber - lift.currentFloor) * 2;
    
        lift.isBusy = true
        lift.currentFloor = floor.floorNumber;
        lift.movingDirection = floor.buttonClicked;
    
        liftEl.style.transform = `translateY(${y}px)`;
        liftEl.style.transition = `${time}s linear`;
    
        openCloseLiftDoors(lift.liftId, time * 1000)
    
        setTimeout(() => {
            lift.isBusy = false
            lift.movingDirection = null
        }, time * 1000 + 5000);
    }
}

function findLiftToBeMoved(floor) {
    let diff = {value: Number.MAX_SAFE_INTEGER, index: null}
    for (let i = 0; i < lifts.length; i++) {
        if (lifts[i].currentFloor !== floor.floorNumber || lifts[i].movingDirection !== floor.buttonClicked) {
            if (!lifts[i].isBusy) {
                if (Math.abs(floor.floorNumber - lifts[i].currentFloor) < diff.value) {
                    diff.value = Math.abs(floor.floorNumber - lifts[i].currentFloor)
                    diff.index = i
                }
            } 
        } else {
            return lifts[i].liftId
        }
    }
    return lifts[diff.index]?.liftId || null
}

function openCloseLiftDoors(liftId, duration) {
    const id = liftId[4]
    const leftDoor = document.getElementById(`left-door${id}`);
    const rightDoor = document.getElementById(`right-door${id}`);

    setTimeout(() => {
        leftDoor.classList.remove('left-door-close');
        rightDoor.classList.remove('right-door-close');
        
        leftDoor.classList.add('left-door-open');
        rightDoor.classList.add('right-door-open');
    }, duration);
    
    setTimeout(() => {
        leftDoor.classList.remove('left-door-open');
        rightDoor.classList.remove('right-door-open');
        
        leftDoor.classList.add('left-door-close');
        rightDoor.classList.add('right-door-close');        
    }, duration + 2500);
}