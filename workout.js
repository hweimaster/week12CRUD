class Workout{
    constructor(name){
        this.name = name;
        this.exercise = [];
    }

    addType(name, reps){
        this.exercise.push(new Type (name, reps));
    }
}

class Exercise{
    constructor(name, reps){
        this.name = name;
        this.reps = reps;
    }
}

class WorkoutService{
    static url = 'http://localhost:3000/workout';


    static getAllWorkouts(){//returns all the workouts 
        return $.get(this.url);
    }

    static getWorkout(id){//gets one specific workout
        return $.get(this.url + `/${id}`)
    }

    static createWorkout(workout){ 
        return $.post(this.url,workout)
    }

    static updateWorkout(workout){
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: 'json',
            data: JSON.stringify(workout),
            contentType: 'application/json',
            type: 'PUT'
        });

    }
    static deleteWorkout(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

class DOMManager{
    static workouts;

    static getAllWorkouts(){
        WorkoutService.getAllWorkouts().then(workouts => this.render(workouts));
    }

    static createWorkout(name){
        WorkoutService.createWorkout(new Workout(name))
        .then(() => {
            return WorkoutService.getAllWorkouts();
        })
        .then((workouts) => this.render(workouts)); 
    }

    static deleteWorkout(id){
        WorkoutService.deleteWorkout(id)//deletes the workout id 
        .then(() => {
            return WorkoutService.getAllWorkouts(); //returns the now current list of workouts 
        })
        .then((workouts) => this.render(workouts)); //rerenders the workouts  
    }

    static addExercise(id){
        for (let workout of this.workouts){
            if (workout._id == id){
                workout.exercise.push(new Exercise($(`#${workout._id}-exercise-name`).val(), $(`#${workout._id}-exercise-reps`).val()));
                WorkoutService.updateWorkout(workout)
                .then(() => {
                    return WorkoutService.getAllWorkouts();
                })
                .then((workouts) => this.render(workouts));
            }
        }
    }

    static deleteExercise(workoutId, exerciseId){
        for (let workout of this.workouts){
            if (workout._id == workoutId){
                for (let exercise of workout.exercises){
                    if (exercise._id == exerciseId){
                        workout.exercises.splice(workout.exercises.indexOr(exercise), 1);
                        WorkoutService.updateWorkout(workout)
                        .then(() => {
                            return WorkoutService.getAllWorkouts();
                        })
                        .then((workouts) => this.render(workouts)); 
                    }
                }
            }
        }
    }

    static render(workouts){
        this.workouts = workouts; 
        $('#second').empty();
        for (let workout of workouts ){
            $('#second').prepend(
                `<div = id "${workouts._id}" class = "card">
                    <div class = "card-header"> 
                    <h2>${workouts.name}</h2>
                    <button class = "btn btn-danger" onclick = "DOMManager.deleteWorkout('${workout._id}')">Delete</button>
                 </div>
                 <div class = "card-body">
                    <div class = "card">
                        <div class = "row">
                        <div class = "col-sm">
                         <input type = "text" id = "${workout._id}-exercise-name" class = "form-control" Placeholder = "Exercise">
                        </div>
                        <div class = "col-sm">
                        <input type = "text" id = "${workout._id}-exercise-rep" class = "form-control" Placeholder = "Reps">
                        </div>
                        </div>
                        <br>
                        <button id = "${workout._id}-new-exercise" onclick ="DOMManger.addWorkout('${workout._id}')" class = "btn btn-primary form-control">Add</button> 
                    </div>
                 </div>
                </div> <br>
                `
            );
            for (let exercise of workout.exercises){
                $(`#${workout._id}`).find('.card-body').append(
                    `<p>
                    <span id = "name-${exercise._id}"><strong> Exercise: </strong> ${exercise.name}</span>
                    <span id = "name-${exercise._id}"><strong> Exercise: </strong> ${exercise.reps}</span>
                    <br>
                    <button class = "btn btn-dark" on-click = "DOMManager.deleteWorkout('${workout._id}', '${exercise._id}')">
                    Delete Exercise</button>` 
                )
            }
        }
    }

}

$('#create-new-workout').click(() => {
    DOMManager.createWorkout($('#create-new-workout').val())
    $('#create-new-workout').val('');
});

DOMManager.getAllWorkouts();