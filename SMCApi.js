SMCApi = {};

/**
 * main exception
 */
SMCApi.ModuleException = function (message) {
    // const error = new Error(message);
    // this.description = description;
    // return error;
    Error.call(this, message);
};
SMCApi.ModuleException.prototype = Object.create(Error.prototype);

SMCApi.ActionType = {
    STAR: 0,
    EXECUTE: 1,
    UPDATE: 2,
    STOP: 3
};

SMCApi.CommandType = {
    STAR: 0,
    EXECUTE: 1,
    UPDATE: 2,
    STOP: 3
};

SMCApi.MessageType = {
    MESSAGE_PROCESS_STATE_CHANGE: 1,

    MESSAGE_ACTION_START: 4,
    MESSAGE_ACTION_STOP: 6,
    MESSAGE_ACTION_ERROR: 7,

    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_SETTING_UPDATE: 108,
    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_UPDATE: 109,
    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_REMOVE: 110,
    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_CREATE: 111,
    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_UPDATE: 112,
    MESSAGE_CONFIGURATION_CONTROL_CONFIGURATION_REMOVE: 113,
    MESSAGE_CONFIGURATION_CONTROL_EXECUTION_CONTEXT_CREATE: 114,
    MESSAGE_CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE: 115,
    MESSAGE_CONFIGURATION_CONTROL_EXECUTION_CONTEXT_REMOVE: 116,
    MESSAGE_CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE: 117,
    MESSAGE_CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE: 118,
    MESSAGE_CONFIGURATION_CONTROL_SOURCE_CONTEXT_REMOVE: 119,
    MESSAGE_CONFIGURATION_CONTROL_CONTAINER_CREATE: 120,
    MESSAGE_CONFIGURATION_CONTROL_CONTAINER_REMOVE: 121,

    MESSAGE_FLOW_CONTROL_EXECUTE_NOW_START: 220,
    MESSAGE_FLOW_CONTROL_EXECUTE_NOW_EXECUTE: 221,
    MESSAGE_FLOW_CONTROL_EXECUTE_NOW_UPDATE: 222,
    MESSAGE_FLOW_CONTROL_EXECUTE_NOW_STOP: 223,
    MESSAGE_FLOW_CONTROL_EXECUTE_PARALLEL_START: 224,
    MESSAGE_FLOW_CONTROL_EXECUTE_PARALLEL_EXECUTE: 225,
    MESSAGE_FLOW_CONTROL_EXECUTE_PARALLEL_UPDATE: 226,
    MESSAGE_FLOW_CONTROL_EXECUTE_PARALLEL_STOP: 227,
    MESSAGE_FLOW_CONTROL_EXECUTE_PARALLEL_WAITING_TACTS: 228,

    MESSAGE_ERROR_TYPE: 1000,
    MESSAGE_DATA: 1001
};

SMCApi.ValueType = {
    STRING: 0,
    BYTE: 1,
    SHORT: 2,
    INTEGER: 3,
    LONG: 4,
    BIG_INTEGER: 5,
    FLOAT: 6,
    DOUBLE: 7,
    BIG_DECIMAL: 8,
    BYTES: 9
};

SMCApi.SourceType = {
    MODULE_CONFIGURATION: 0,
    EXECUTION_CONTEXT: 1,
    STATIC_VALUE: 2,
    MULTIPART: 3,
    CALLER: 4,
    CALLER_RELATIVE_NAME: 5
};

SMCApi.SourceGetType = {
    ALL: 0,
    NEW: 1,
    NEW_ALL: 2,
    LAST: 3,
    LAST_ALL: 4
};

SMCApi.Map = function () {
    this.keys = [];
    this.data = {};

    this.put = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.remove = function (key) {
        // this.keys.remove(key);
        var index = this.indexOf(o);
        if (index > -1) {
            this.splice(index, 1);
            var value = this.data[key];
            this.data[key] = null;
            delete this.data[key];
            return value;
        }
        return null;
    };

    this.each = function (fn) {
        if (typeof fn !== 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };

    this.entries = function () {
        var len = this.keys.length;
        var entries = new Array(len);
        for (var i = 0; i < len; i++) {
            entries[i] = {
                key: this.keys[i],
                value: this.data[this.keys[i]]
            };
        }
        return entries;
    };

    this.isEmpty = function () {
        return this.keys.length === 0;
    };

    this.size = function () {
        return this.keys.length;
    };
};

/**
 * Interface for value objects
 */
SMCApi.IValue = {

    /**
     * value type
     *
     * @return SMCApi.ValueType
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * value as object
     *
     * @return Object
     */
    getValue: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Message
 * @parent SMCApi.IValue
 */
SMCApi.IMessage = {

    /**
     * get date of creation
     *
     *  @return Date
     */
    getDate: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get message type for process messages - DATA
     *
     *  @return SMCApi.MessageType
     */
    getMessageType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.IMessage.prototype = SMCApi.IValue;

/**
 * Interface for Action
 */
SMCApi.IAction = {

    /**
     * get messages
     *
     *  @return Array[SMCApi.IMessage]
     */
    getMessages: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get type
     *
     *  @return SMCApi.ActionType
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Command
 */
SMCApi.ICommand = {

    /**
     * get actions
     *
     *  @return Array[SMCApi.IAction]
     */
    getActions: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get type
     *
     *  @return SMCApi.CommandType
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * for cfgs
 * @type {{}}
 */
SMCApi.CFG = {};

/**
 * Interface for Module
 */
SMCApi.CFG.IModule = {

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count sources
     *
     *  @return number
     */
    getMinCountSources: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count sources
     *
     *  @return number
     */
    getMaxCountSources: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count execution contexts
     *
     *  @return number
     */
    getMinCountExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count execution contexts
     *
     *  @return number
     */
    getMaxCountExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count managed configurations
     *
     *  @return number
     */
    getMinCountManagedConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count managed configurations
     *
     *  @return number
     */
    getMaxCountManagedConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Container
 */
SMCApi.CFG.IContainer = {

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is configuration work
     *
     *  @return boolean
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Container
 *
 * @parent SMCApi.CFG.IContainer
 */
SMCApi.CFG.IContainerManaged = {

    /**
     * count child configurations
     *
     *  @return number
     */
    countConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get child configuration
     *
     *  @param id   number                              serial number in the list of child configurations
     *  @return SMCApi.CFG.IConfiguration or null
     */
    getConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count child managed configurations
     *
     *  @return number
     */
    countManagedConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get child managed configuration
     *
     *  @param id   number                              serial number in the list of child managed configurations
     *  @return SMCApi.CFG.IConfigurationManaged or null
     */
    getManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count child containers
     *
     *  @return number
     */
    countContainers: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get child container
     *
     *  @param id   number                              serial number in the list of child containers
     *  @return SMCApi.CFG.IConfiguration or null
     */
    getContainer: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create child container
     *
     *  @param name string                              unique name for container
     *  @return SMCApi.CFG.IContainerManaged
     */
    createContainer: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * delete empty child container
     *
     *  @param id   number                              serial number in the list of child containers
     *  @return void
     */
    removeContainer: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IContainerManaged.prototype = SMCApi.CFG.IContainer;


/**
 * Interface for Module Configuration
 */
SMCApi.CFG.IConfiguration = {

    /**
     * get module
     *  @return SMCApi.CFG.IModule
     */
    getModule: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get description
     *
     *  @return string
     */
    getDescription: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get all settings
     *
     *  @return SMCApi.Map[string, SMCApi.IValue]
     */
    getAllSettings: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get setting value
     *
     *  @param key  string                              setting name
     *  @return SMCApi.IValue or null
     */
    getSetting: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get all variables
     *
     *  @return SMCApi.Map[string, SMCApi.IValue]
     */
    getAllVariables: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get variable value
     *
     *  @param key  string                              variable name
     *  @return SMCApi.IValue or null
     */
    getVariable: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get buffer size
     *
     *  @return number
     */
    getBufferSize: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is configuration work
     *
     *  @return boolean
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Module Configuration
 *
 * @parent SMCApi.CFG.IConfiguration
 */
SMCApi.CFG.IConfigurationManaged = {

    /**
     * change name
     *
     *  @param name string                              unique name for container
     *  @return void
     */
    setName: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change setting
     *
     *  @param key  string                              variable name
     *  @param value    Object                          value object (string, number, bytes)
     *  @return void
     */
    setSetting: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change variable
     *
     *  @param key  string                             variable name
     *  @param value    Object                           value object (string, number, bytes)
     *  @return void
     */
    setVariable: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove variable
     *
     *  @param key  string                             variable name
     *  @return void
     */
    removeVariable: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change buffer size
     *
     *  @param bufferSize   number                      1 is minimum
     *  @return void
     */
    setBufferSize: function (bufferSize) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * enable or disable configuration
     *
     *  @param enable   boolean                         true for enable
     *  @return void
     */
    setEnable: function (enable) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count execution contexts
     *
     *  @return number
     */
    countExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get execution context
     *
     *  @param id   number                              serial number in the list of Execution Contexts
     *  @return SMCApi.CFG.IExecutionContextManaged or null
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create execution context and bind it to this configuration
     *
     *  @param name string                              unique name for configuration
     *  @param maxWorkInterval  number                  max work interval. if -1, no time limit. in milliseconds. default is -1
     *  @return SMCApi.CFG.IExecutionContextManaged
     */
    createExecutionContext: function (name, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * delete execution context
     *
     *  @param id   number                              serial number in the list of Execution Contexts
     *  @return void
     */
    removeExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get container
     *
     *  @return SMCApi.CFG.IContainerManaged or null
     */
    getContainer: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IConfigurationManaged.prototype = SMCApi.CFG.IConfiguration;

/**
 * Interface for Execution Context
 */
SMCApi.CFG.IExecutionContext = {

    /**
     * get configuration
     *
     * @return SMCApi.CFG.IConfiguration
     */
    getConfiguration: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get max work interval in milliseconds
     * if -1, no time limit
     *
     *  @return number
     */
    getMaxWorkInterval: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is work
     *
     *  @return boolean     true if work
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Execution Context
 *
 * @parent SMCApi.CFG.ISourceList
 */
SMCApi.CFG.IExecutionContextManaged = {

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get max work interval in milliseconds
     * if -1, no time limit
     *
     *  @return number
     */
    getMaxWorkInterval: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is work
     *
     *  @return boolean     true if work
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change name
     *
     *  @param name string                              unique name for configuration
     *  @return void
     */
    setName: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change max work interval
     *
     *  @param maxWorkInterval  number                  if -1, no time limit. in milliseconds
     *  @return void
     */
    setMaxWorkInterval: function (maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * enable or disable
     *
     *  @param enable   boolean                         true for enable
     *  @return void
     */
    setEnable: function (enable) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count execution contexts
     *
     *  @return number
     */
    countExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get execution context
     *
     *  @param id  number                               serial number in the list of Execution Contexts
     *  @return SMCApi.CFG.IExecutionContext or null
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * insert execution context in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   number                              serial number in the list of Execution Contexts
     *  @param executionContext SMCApi.CFG.IExecutionContext    execution context
     *  @return void
     */
    insertExecutionContext: function (id, executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove execution context from list
     *
     *  @param id   number                              serial number in the list of Execution Contexts
     *  @return void
     */
    removeExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count managed configurations
     *
     *  @return number
     */
    countManagedConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get managed configuration
     *
     *  @param id   number                              serial number in the list of Managed configurations
     *  @return SMCApi.CFG.IConfiguration or null
     */
    getManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * insert configuration in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   number                              serial number in the list of Managed configurations
     *  @param configuration    SMCApi.CFG.IConfiguration   configuration
     *  @return void
     */
    insertManagedConfiguration: function (id, configuration) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove configuration from list
     *
     *  @param id   number                              serial number in the list of Managed configurations
     *  @return void
     */
    removeManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IExecutionContextManaged.prototype = SMCApi.CFG.ISourceList;

/**
 * Interface for Source
 */
SMCApi.CFG.ISource = {

    /**
     * get type of source.
     *
     * @return SMCApi.SourceType
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get value
     * depend on type
     *
     * @return SMCApi.CFG.IConfiguration for MODULE_CONFIGURATION, IExecutionContext for EXECUTION_CONTEXT, SMCApi.IValue for STATIC_VALUE, null for MULTIPART
     */
    getValue: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get order.
     * determines the position in the source list.
     *
     * @return int
     */
    getOrder: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is source event driven
     *
     * @return true if it is true
     */
    isEventDriven: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get source list
     *
     * @return SMCApi.CFG.ISourceList for MULTIPART or null
     */
    getList: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

SMCApi.CFG.ISourceList = {

    /**
     * count sources
     *
     * @return int
     */
    countSources: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get source
     *
     * @param id    number                              serial number in the list of sources
     * @return SMCApi.CFG.ISource or null
     */
    getSource: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is MODULE_CONFIGURATION
     *
     * @param configuration SMCApi.CFG.IConfiguration   configuration source.
     * @param getType   SMCApi.SourceGetType            type of get commands from source.  default NEW.
     * @param countLast number                          only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   boolean                     if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISource
     */
    createSourceConfiguration: function (configuration, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is EXECUTION_CONTEXT
     *
     * @param executionContext SMCApi.CFG.IExecutionContext    execution context source.
     * @param getType   SMCApi.SourceGetType            type of get commands from source.
     * @param countLast number                          only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   boolean                     if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISource
     */
    createSourceExecutionContext: function (executionContext, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is STATIC_VALUE
     *
     * @param value SMCApi.IValue                       value (String, Number or byte array)
     * @return SMCApi.CFG.ISource
     */
    createSourceValue: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of list (order = max_order + 1)
     * created ContextSourceType is MULTIPART
     *
     *  @return SMCApi.CFG.ISource
     */
    createSource: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change order - up.
     *
     * @param id    number                              serial number in the list of sources
     * @return void
     */
    changeOrderUp: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change order - down.
     *
     * @param id    number                              serial number in the list of sources
     * @return void
     */
    changeOrderDown: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove source from list
     *
     * @param id    number                              serial number in the list of sources
     * @return void
     */
    removeSource: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * tool for work with unmodifiable files
 */
SMCApi.FileTool = {

    /**
     * get name
     *
     *  @return string
     */
    getName: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is file exist
     *
     *  @return boolean
     */
    exists: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is directory
     *
     *  @return boolean
     */
    isDirectory: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get files in folder
     *
     *  @return Array[SMCApi.FileTool]
     */
    getChildrens: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * reed all file
     *
     *  @return bytes
     */
    getBytes: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * file size
     *
     *  @return number
     */
    length: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Main module interface
 */
SMCApi.Module = {

    /**
     * call once per process on start
     *
     *  @param configurationTool    SMCApi.ConfigurationTool
     *  @return void
     */
    start: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * main method. call every time when need execute
     *
     *  @param configurationTool    SMCApi.ConfigurationTool
     *  @param executionContextTool SMCApi.ExecutionContextTool
     *  @return void
     */
    process: function (configurationTool, executionContextTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * call then need update
     *
     *  @param configurationTool    SMCApi.ConfigurationTool
     *  @return void
     */
    update: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * call once per process on stop
     *
     *  @param configurationTool    SMCApi.ConfigurationTool
     *  @return void
     */
    stop: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * main configuration tool
 *
 * @parent SMCApi.CFG.IConfiguration
 */
SMCApi.ConfigurationTool = {

    /**
     * change variable
     *
     *  @param key  string                             variable name
     *  @param value    Object                           value object (string, number, bytes)
     *  @return void
     */
    setVariable: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is variable has changed from last execution or last check
     * usfull for check changes from external (processes or user)
     *
     *  @param key  string                             variable name
     *  @return boolean
     */
    isVariableChanged: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove variable
     *
     *  @param key  string                             variable name
     *  @return void
     */
    removeVariable: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get module folder
     * contains all files, what was in smcm file
     *
     *  @return SMCApi.FileTool
     */
    getHomeFolder: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get full path to work directory
     * only if module allow this
     *
     *  @return string
     */
    getWorkDirectory: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count configuration execution contexts
     *
     * @return int
     */
    countExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get execution context
     *
     * @param id    number                              serial number in the list of Execution Contexts
     * @return SMCApi.CFG.IExecutionContext or null
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get container
     *
     *  @return SMCApi.CFG.IContainerManaged or null
     */
    getContainer: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check if has license
     *
     * @param freeDays  int                             free trial days. 0 or more.
     * @return boolean - true if has license
     */
    hasLicense: function (freeDays) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.ConfigurationTool.prototype = SMCApi.CFG.IConfiguration.prototype;

/**
 * main execution context tool
 */
SMCApi.ExecutionContextTool = {

    /**
     * emit message
     *
     *  @param value    Object                          object (string, number, bytes)
     *  @return void
     */
    addMessage: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * emit error message
     *
     *  @param value    Object                          object (string, number, bytes)
     *  @return void
     */
    addError: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get count sources
     *
     *  @return number
     */
    countSource: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get count commands in source
     *
     *  @param sourceId number                          serial number in the list of Sources
     *  @return number
     */
    countCommands: function (sourceId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get count commands (all) for managed execution context
     *
     * @param executionContext  SMCApi.CFG.IExecutionContextManaged     managed execution context
     * @return count
     */
    countCommandsFromExecutionContext: function (executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Actions from source (only DATA messages)
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param sourceId     number                      serial number in the list of Sources
     *  @param fromIndex    number                      start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param toIndex      number                      end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return Array[SMCApi.IAction]
     */
    getMessages: function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Commands from source
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param sourceId     number                      serial number in the list of Sources
     *  @param fromIndex    number                      start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param toIndex      number                      end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return Array[SMCApi.ICommand]
     */
    getCommands: function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Commands from managed execution context
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     * @param executionContext SMCApi.CFG.IExecutionContextManaged  managed execution context
     * @param fromIndex number                          start serial number in the list of commands
     * @param toIndex   number                          end serial number in the list of commands
     * @return list of commands
     */
    getCommandsFromExecutionContext: function (executionContext, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is Process Actions has errors
     *
     *  @param action   SMCApi.IAction
     *  @return boolean
     */
    isError: function (action) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get tool for work with managed configurations
     *
     *  @return SMCApi.ConfigurationControlTool
     */
    getConfigurationControlTool: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get tool for throw new command to managed execution contexts and get result
     *
     *  @return SMCApi.FlowControlTool
     */
    getFlowControlTool: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is need stop process work immediately
     * usefull for long work (example - web server)
     *
     *  @return boolean
     */
    isNeedStop: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.ExecutionContextTool.prototype = SMCApi.CFG.IExecutionContext.prototype;

/**
 * Tool for work with managed configurations
 */
SMCApi.ConfigurationControlTool = {

    /**
     * list of all installed modules
     *
     * @return Array[SMCApi.CFG.IModule]
     */
    getModules: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count managed configurations
     *
     *  @return number
     */
    countManagedConfigurations: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get managed configuration
     *
     * @param id    number                              serial number in the list of Managed configurations
     * @return SMCApi.CFG.IConfigurationManaged or null
     */
    getManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create configuration and add it in list of managed configurations
     *
     * @param id    number                              index at which the specified element is to be inserted
     * @param container    SMCApi.CFG.IContainer        container
     * @param module    SMCApi.CFG.IModule              module
     * @param name  string                              unique name for configuration
     * @return SMCApi.CFG.IConfigurationManaged
     */
    createConfiguration: function (id, container, module, name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove managed configuration
     *
     * @param id    number                              serial number in the list of Managed configurations
     * @return void
     */
    removeManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Tool for throw new command to managed execution contexts and get result
 */
SMCApi.FlowControlTool = {

    /**
     * count managed execution contexts
     *
     *  @return number
     */
    countManagedExecutionContexts: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * throw new command to managed execution context
     * command execute in this thread
     * function will wait for the command to execute
     *
     *  @param SMCApi.CommandType   type                type of command
     *  @param number   managedId                       serial number in the list of Managed execution contexts
     *  @param Array[Object]   values                   list of values for create dummy messages from this process, or null
     *  @return void
     */
    executeNow: function (type, managedId, values) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * throw new command to managed execution context
     * command execute in new thread
     * function return control immediately
     *
     *  @param SMCApi.CommandType   type                type of command
     *  @param Array[number]   managedIds               list of serial numbers in the list of Managed execution contexts
     *  @param Array[Object]   values                   list of values for create dummy messages from this process, or null
     *  @param number   waitingTacts                    if it is necessary that the new thread first wait for the specified time (in tacts). if 0 then using data from current thread. default is 0.
     *  @param number   maxWorkInterval                 define max work interval of new thread (in tacts). if -1 then no limit. default is -1.
     *  @return number  id of thread
     */
    executeParallel: function (type, managedIds, values, waitingTacts, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is thread alive
     *
     *  @param number  threadId                         id thread
     *  @return boolean
     */
    isThreadActive: function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param number  threadId                         id thread. if 0 then using data from current thread. default is 0.
     *  @param number  managedId                        serial number in the list of Managed execution contexts. default is 0.
     *  @return Array[SMCApi.IAction] only DATA messages
     */
    getMessagesFromExecuted: function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param number  threadId                         id thread. if 0 then using data from current thread. default is 0.
     *  @param number  managedId                        serial number in the list of Managed execution contexts. default is 0.
     *  @return Array[SMCApi.ICommand]
     */
    getCommandsFromExecuted: function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * after executeParallel and work with him, need to release thread
     *
     *  @param number  threadId                         id thread
     *  @return void
     */
    releaseThread: function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get managed execution context
     *
     * @param id                                        serial number in the list of Managed execution contexts
     * @return SMCApi.CFG.IExecutionContext or null
     */
    getManagedExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
