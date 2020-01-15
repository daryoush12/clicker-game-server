
function GameInstancesManager() {
    this.rooms = [];

    function AddRoom(value){
        this.rooms.push(value);
    }
}

module.exports = GameInstancesManager;