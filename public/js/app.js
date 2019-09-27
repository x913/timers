class TimersDashboard extends React.Component {
    state = {
        timers: []
    }

    constructor(props) {
        super(props);
        setTimeout(this.updateTimers, 1000);
    }

    updateTimers = () => {

    }

    componentDidMount() {
        this.setState({
            timers: [
                {
                    "title": "Mow the lawn",
                    "project": "House Chores",
                    "elapsed": 5456099,
                    "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d7",
                    "runningSince": 1569573533699,
                    "isTimerRunning": true,
                },
                {
                    "title": "Learn React",
                    "project": "Web Dominate",
                    "elapsed": 9456099,
                    "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d8",
                    "runningSince": 1569573533600,
                    "isTimerRunning": true,
                },

            ]
        });
        this.interval = setInterval(() => {
            const updatedTimers = this.state.timers.map(timer => {
                if (timer.isTimerRunning)
                    timer.elapsed += 1000;
                return timer;
            })
            this.setState({ timers: updatedTimers });
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    onTimerPropertiesUpdated = (updatedTimer) => {
        const updatedTimers = this.state.timers.map(timer => {
            if (timer.id === updatedTimer.id) {
                timer.title = updatedTimer.title;
                timer.project = updatedTimer.project;
            }
            return timer;
        })
        this.setState({ timers: updatedTimers });
    }

    onTimerRemove = (id) => {
        const updatedTimers = this.state.timers.filter(timer => timer.id !== id);
        this.setState({ timers: updatedTimers });
    }

    toggleTimerRunning = (id, flag) => {
        const updatedTimers = this.state.timers.map(timer => {
            if (timer.id === id) {
                timer.isTimerRunning = flag;
            }
            return timer;
        });
        this.setState({ timers: updatedTimers });
    }

    // add new timer
    onSubmitEditClick = (newTimer) => {
        const updatedTimers = this.state.timers.concat([{
            title: newTimer.title,
            project: newTimer.project,
            elapsed: 0,
            runningSince: new Date().getTime(),
            id: new Date().getTime(),
            isTimerRunning: true,
        }]);
        this.setState({ timers: updatedTimers });
    }

    render() {
        return (
            <div className="ui three column centered grid">
                <div className="column">
                    {/* Show list of editabled timers */}
                    {
                        this.state.timers.map(timer => <EditableTimer
                            id={timer.id}
                            key={timer.id}
                            title={timer.title}
                            project={timer.project}
                            elapsed={timer.elapsed}
                            runningSince={timer.runningSince}
                            onTimerPropertiesUpdated={this.onTimerPropertiesUpdated}
                            onTimerRemove={this.onTimerRemove}
                            isTimerRunning={timer.isTimerRunning}
                            toggleTimerRunning={this.toggleTimerRunning}
                        />)
                    }
                    <ToggleabbleTimer onSubmitEditClick={this.onSubmitEditClick} />
                </div>
            </div>);
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }

    onEditClick = () => {
        this.setState({ editFormOpen: true });
    }

    onCancelClick = () => {
        this.setState({ editFormOpen: false });
    }

    onSubmitEditClick = (updatedTimerProperties) => {
        this.setState({ editFormOpen: false });
        this.props.onTimerPropertiesUpdated(updatedTimerProperties);
    }

    render() {
        const { id, title, project, elapsed, runningSince, isTimerRunning, toggleTimerRunning } = this.props;
        if (this.state.editFormOpen) {
            return (
                <TimerEditing
                    id={id}
                    title={title}
                    project={project}
                    onCancelClick={this.onCancelClick}
                    onSubmitEditClick={this.onSubmitEditClick}
                />
            )
        } else {
            return (
                <TimerRunning
                    id={id}
                    title={title}
                    project={project}
                    elapsed={elapsed}
                    runningSince={runningSince}
                    onEditClick={this.onEditClick}
                    onTimerRemove={() => this.props.onTimerRemove(this.props.id)}
                    isTimerRunning={isTimerRunning}
                    toggleTimerRunning={toggleTimerRunning}
                />
            )
        }
    }
}

class TimerRunning extends React.Component {
    render() {
        const { id, title, project, elapsed, isTimerRunning, toggleTimerRunning } = this.props;
        const elapsedString = helpers.renderElapsedString(elapsed);

        return (
            <div>
                <div className="ui centered card">
                    <div className="content" >
                        <div className="header">
                            {title}
                        </div>
                        <div className="meta">
                            {project}
                        </div>
                        <div className="center aligned description">
                            <h2>{elapsedString}</h2>
                        </div>

                        <TimerActionButton isTimerRunning={isTimerRunning} toggleTimerRunning={toggleTimerRunning} id={id} />

                        <div className="extra content" >
                            <span className="right floated edit icon" onClick={() => this.props.onEditClick(id)}>
                                <i className="edit icon"></i>
                            </span>
                            <span className="right floated trash icon" onClick={() => this.props.onTimerRemove(id)}>
                                <i className="trash icon" />
                            </span>
                        </div>



                    </div>
                </div>
            </div>
        );
    }
}

class TimerEditing extends React.Component {

    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitEditClick = () => {
        this.props.onSubmitEditClick({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });
    }

    render() {
        const { onCancelClick } = this.props;
        const submitText = this.props.title ? "Update" : "Create";

        return (
            <div className="ui centered card">
                <div className="content">
                    <div className="ui form">
                        <div className="field">
                            <label>Title</label>
                            <input type="text" name="title" value={this.state.title} onChange={this.onChange} />
                        </div>
                        <div className="field">
                            <label>Project</label>
                            <input type="text" name="project" value={this.state.project} onChange={this.onChange} />
                        </div>
                        <div className="ui two bottom attached buttons">
                            <button className="ui basic blue button" onClick={this.onSubmitEditClick}>{submitText}</button>
                            <button className="ui basic red button" onClick={onCancelClick}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class TimerActionButton extends React.Component {



    render() {
        const { id, toggleTimerRunning, isTimerRunning } = this.props;
        if (isTimerRunning) {
            return (
                <div className="ui bottom attached red basic button" onClick={() => toggleTimerRunning(id, false)}>
                    Stop
                </div>
            )
        } else {
            return (
                <div className="ui bottom attached green basic button" onClick={() => toggleTimerRunning(id, true)}>
                    Start
                </div>
            )
        }
    }
}

class ToggleabbleTimer extends React.Component {
    state = {
        isEditing: false
    }

    setEditMode = () => {
        this.setState({ isEditing: true })
    }

    onCancelClick = () => {
        this.setState({ isEditing: false })
    }

    onSubmitEditClick = (newTimer) => {
        this.setState({ isEditing: false });
        this.props.onSubmitEditClick(newTimer);
    }

    render() {
        if (this.state.isEditing) {
            return (<TimerEditing onCancelClick={this.onCancelClick} onSubmitEditClick={this.onSubmitEditClick} />)
        } else {
            return (
                <div className="ui basic content center aligned segment">
                    <button className="ui basic button icon" title="Add new timer" onClick={this.setEditMode}>
                        <i className='plus icon' />
                    </button>
                </div>
            )
        }
    }

}

ReactDOM.render(<TimersDashboard />, document.getElementById("content"));