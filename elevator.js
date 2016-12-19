{
  init: function(elevators, floors) {

    var ups = [], downs = []

    floors.forEach(function(floor) {
      floor.on("up_button_pressed", function() {
        if((ups.indexOf(floor.floorNum()) == -1))
          ups.splice(0,0,floor.floorNum());
      });
      floor.on("down_button_pressed", function() {
        if((downs.indexOf(floor.floorNum()) == -1))
          downs.splice(0,0,floor.floorNum());
      });
    });

    elevators.forEach(function(elevator) {
      elevator.on("idle", function() {
        if(ups.length > 0 && downs.length > 0){
          if(Math.abs(ups[ups.length-1] - elevator.currentFloor()) < Math.abs(downs[downs.length-1] - elevator.currentFloor()))
            elevator.goToFloor(ups.pop());
          else
            elevator.goToFloor(downs.pop());
        }
        else if(ups.length > 0)
          elevator.goToFloor(ups.pop());
        else if(downs.length > 0)
          elevator.goToFloor(downs.pop());
        else
          elevator.goToFloor(elevator.currentFloor());
      });

      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
      });

      elevator.on("stopped_at_floor", function(floorNum) {
        elevator.destinationQueue = elevator.destinationQueue.filter(n => n != floorNum);
        elevator.checkDestinationQueue();
        if (elevator.destinationQueue.length) {
          var goingUp = elevator.destinationQueue[0] > floorNum;
          elevator.goingUpIndicator(goingUp);
          elevator.goingDownIndicator(!goingUp);
        } else {
          elevator.goingUpIndicator(true);
          elevator.goingDownIndicator(true);
        }

        var i = ups.indexOf(floorNum);
        if(i != -1 && elevator.goingUpIndicator()) {
          ups.splice(i, 1);
        }

        var i = downs.indexOf(floorNum);
        if(downs.indexOf(floorNum) != -1 && elevator.goingDownIndicator()) {
          downs.splice(i, 1);
        }
      });

      elevator.on("passing_floor", function(floorNum, direction) {
        if(elevator.destinationQueue.indexOf(floorNum) != -1){
          elevator.goToFloor(floorNum, true);
        } else if(elevator.loadFactor() <= 0.75) {
          if(ups.indexOf(floorNum) != -1 && direction == 'up') {
            elevator.goToFloor(floorNum, true);
          }
          if(downs.indexOf(floorNum) != -1 && direction == 'down') {
            elevator.goToFloor(floorNum, true);
          }
        }
      });
    });
  },
    update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
    }
}
