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
    PROCESS_STATE_CHANGE: 1,

    ACTION_START: 4,
    ACTION_STOP: 6,
    ACTION_ERROR: 7,

    CONFIGURATION_CONTROL_CONFIGURATION_SETTING_UPDATE: 108,
    CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_UPDATE: 109,
    CONFIGURATION_CONTROL_CONFIGURATION_VARIABLE_REMOVE: 110,
    CONFIGURATION_CONTROL_CONFIGURATION_CREATE: 111,
    CONFIGURATION_CONTROL_CONFIGURATION_UPDATE: 112,
    CONFIGURATION_CONTROL_CONFIGURATION_REMOVE: 113,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_CREATE: 114,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_UPDATE: 115,
    CONFIGURATION_CONTROL_EXECUTION_CONTEXT_REMOVE: 116,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_CREATE: 117,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_UPDATE: 118,
    CONFIGURATION_CONTROL_SOURCE_CONTEXT_REMOVE: 119,
    CONFIGURATION_CONTROL_CONTAINER_CREATE: 120,
    CONFIGURATION_CONTROL_CONTAINER_REMOVE: 121,

    FLOW_CONTROL_EXECUTE_NOW_START: 220,
    FLOW_CONTROL_EXECUTE_NOW_EXECUTE: 221,
    FLOW_CONTROL_EXECUTE_NOW_UPDATE: 222,
    FLOW_CONTROL_EXECUTE_NOW_STOP: 223,
    FLOW_CONTROL_EXECUTE_PARALLEL_START: 224,
    FLOW_CONTROL_EXECUTE_PARALLEL_EXECUTE: 225,
    FLOW_CONTROL_EXECUTE_PARALLEL_UPDATE: 226,
    FLOW_CONTROL_EXECUTE_PARALLEL_STOP: 227,
    FLOW_CONTROL_EXECUTE_PARALLEL_WAITING_TACTS: 228,

    ERROR: 1000,
    DATA: 1001,
    LOG: 1002
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
    BYTES: 9,
    OBJECT_ARRAY: 10,
    BOOLEAN: 11
};

SMCApi.SourceType = {
    MODULE_CONFIGURATION: 0,
    EXECUTION_CONTEXT: 1,
    STATIC_VALUE: 2,
    MULTIPART: 3,
    CALLER: 4,
    CALLER_RELATIVE_NAME: 5,
    OBJECT_ARRAY: 6
};

SMCApi.SourceGetType = {
    ALL: 0,
    NEW: 1,
    NEW_ALL: 2,
    LAST: 3,
    LAST_ALL: 4
};

SMCApi.SourceFilterType = {
    POSITION: 0,
    NUMBER: 1,
    STRING_EQUAL: 2,
    STRING_CONTAIN: 3,
    OBJECT_PATHS: 4
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
     *  @return SMCApi.IAction[]
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

SMCApi.ObjectType = {
    OBJECT_ARRAY: 0,
    OBJECT_ELEMENT: 1,
    VALUE_ANY: 2,
    STRING: 3,
    BYTE: 4,
    SHORT: 5,
    INTEGER: 6,
    LONG: 7,
    FLOAT: 8,
    DOUBLE: 9,
    BIG_INTEGER: 10,
    BIG_DECIMAL: 11,
    BYTES: 12,
    BOOLEAN: 13
};

/**
 * ObjectField
 * @param name {string}                                   name
 * @param value object                                  value
 * @param type {SMCApi.ObjectType}                        type
 * @constructor
 */
SMCApi.ObjectField = function (name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
    const that = this;

    if (value && typeof type === undefined)
        this.setValue(value)

    this.setValue = function (value) {
        this.value = value

        let valueType = undefined;
        if (typeof value !== undefined) {
            if (value instanceof SMCApi.ObjectArray) {
                valueType = SMCApi.ObjectType.OBJECT_ARRAY;
            } else if (value instanceof SMCApi.ObjectElement) {
                valueType = SMCApi.ObjectType.OBJECT_ELEMENT;
            } else if (value instanceof SMCApi.ObjectField) {
                this.type = value.getType()
                this.value = value.getValue()
            } else if (value instanceof SMCApi.IValue) {
                this.type = SMCApi.ObjectType[value.getType()]
                this.value = value.getValue()
            } else if (Object.prototype.toString.call(value) === "[object String]") {
                valueType = SMCApi.ObjectType.STRING;
            } else if (Array.isArray(value)) {
                valueType = SMCApi.ObjectType.BYTES;
            } else if (value === false || value === true) {
                valueType = SMCApi.ObjectType.BOOLEAN;
            } else if (Number.isInteger(value)) {
                valueType = SMCApi.ObjectType.LONG;
            } else if (!Number.isInteger(value) && Number.isFinite(value)) {
                valueType = SMCApi.ObjectType.DOUBLE;
            } else {
                valueType = SMCApi.ObjectType.DOUBLE;
                this.value = value.doubleValue ? value.doubleValue() : 0
            }
        }
        if (valueType === undefined)
            valueType = SMCApi.ObjectType.STRING;
        this.type = valueType;
    }
    /**
     * @returns {string}
     */
    this.getName = function () {
        return this.name
    }
    this.getType = function () {
        return this.type
    }
    this.getValue = function () {
        return this.value
    }
    this.isSimple = function () {
        return SMCApi.ObjectType.OBJECT_ARRAY !== this.type && SMCApi.ObjectType.OBJECT_ELEMENT !== this.type;
    }
    SMCApi.ObjectField.prototype.toString = function () {
        return `${that.type} ${that.name}=${that.value}`;
    }
}

/**
 * ObjectElement
 * @param fields {SMCApi.ObjectField[]}                          fields
 * @constructor
 */
SMCApi.ObjectElement = function (fields) {
    this.fields = typeof fields !== undefined && Array.isArray(fields) ? fields.slice() /*Array.copyOf(fields, fields.length)*/ /*fields.clone()*/ : [];
    const that = this;
    this.getFields = function () {
        return this.getFields;
    }
    this.findField = function (name) {
        return fields.find(v => v.name === name);
    }
    this.findFieldIgnoreCase = function (name) {
        return fields.find(v => v.name.toUpperCase() === name.toUpperCase());
    }
    this.isSimple = function () {
        return !fields.some(v => !v.isSimple());
    }
    SMCApi.ObjectElement.prototype.toString = function () {
        return `{count=${that.fields.length}, fields=${that.fields}`;
    }
}

/**
 * ObjectArray
 * @param typev {SMCApi.ObjectType}                       type
 * @param objects {object[]}                         objects
 * @constructor
 */
SMCApi.ObjectArray = function (typev, objects) {
    this.type = typev
    this.objects = []
    if (typeof objects !== undefined && Array.isArray(objects)) {
        for (let obj in objects)
            this.add(obj);
    }
    const that = this;

    this.check = function (value, valueType) {
        if (typeof objects === undefined)
            throw new SMCApi.ModuleException('obj is None');
        if (typeof valueType === undefined)
            throw new SMCApi.ModuleException('obj is None');
        if (this.type === SMCApi.ObjectType.OBJECT_ARRAY) {
            if (!(value instanceof SMCApi.ObjectArray))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.OBJECT_ELEMENT) {
            if (!(value instanceof SMCApi.ObjectElement))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.VALUE_ANY) {
            if (Object.prototype.toString.call(value) !== "[object String]" && !Array.isArray(value) && !Number.isInteger(value) && !(!Number.isInteger(value) && Number.isFinite(value)) && (value !== false && value !== true))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.STRING) {
            if (Object.prototype.toString.call(value) !== "[object String]")
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BYTES) {
            if (!Array.isArray(value))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BYTE || this.type === SMCApi.ObjectType.SHORT || this.type === SMCApi.ObjectType.INTEGER || this.type === SMCApi.ObjectType.LONG) {
            if (!Number.isInteger(value))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.FLOAT || this.type === SMCApi.ObjectType.DOUBLE) {
            if (!(!Number.isInteger(value) && Number.isFinite(value)))
                throw new SMCApi.ModuleException('wrong obj type');
        } else if (this.type === SMCApi.ObjectType.BOOLEAN) {
            if (value !== false && value !== true)
                throw new SMCApi.ModuleException('wrong obj type');
        }
    }
    this.size = function () {
        return this.objects.length;
    }
    this.get = function (id) {
        return this.objects[id];
    }
    this.add = function (obj) {
        if (obj instanceof SMCApi.ObjectField) {
            obj = obj.getValue();
        } else if (obj instanceof SMCApi.IValue) {
            obj = obj.getValue();
        }
        this.check(obj);
        this.objects.push(obj);
    }
    this.set = function (id, obj) {
        if (obj instanceof SMCApi.ObjectField) {
            obj = obj.getValue();
        } else if (obj instanceof SMCApi.IValue) {
            obj = obj.getValue();
        }
        this.check(obj);
        this.objects[id] = obj;
    }
    this.remove = function (id) {
        delete this.objects.splice(id, 1);
    }
    this.getType = function () {
        return this.type;
    }
    this.isSimple = function () {
        return SMCApi.ObjectType.OBJECT_ARRAY !== this.type && SMCApi.ObjectType.OBJECT_ELEMENT !== this.type;
    }
    SMCApi.ObjectArray.prototype.toString = function () {
        return `[size=${that.objects.length}, objects=${that.objects}, type=${that.type}]`;
    }
}


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
     * get count types
     *
     *  @return number
     */
    countTypes: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get type name
     *  @param typeId number                    serial number in the list of types
     *  @return string
     */
    getTypeName: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count sources
     *
     * @param typeId number                    serial number in the list of types
     *  @return number
     */
    getMinCountSources: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count sources
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    getMaxCountSources: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count execution contexts
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    getMinCountExecutionContexts: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count execution contexts
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    getMaxCountExecutionContexts: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get minimum count managed configurations
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    getMinCountManagedConfigurations: function (typeId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get maximum count managed configurations
     *
     * @param typeId {number}                    serial number in the list of types
     *  @return number
     */
    getMaxCountManagedConfigurations: function (typeId) {
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
     *  @param id   {number}                              serial number in the list of child managed configurations
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
     *  @param id   {number}                              serial number in the list of child containers
     *  @return SMCApi.CFG.IConfiguration or null
     */
    getContainer: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create child container
     *
     *  @param name {string}                              unique name for container
     *  @return SMCApi.CFG.IContainerManaged
     */
    createContainer: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * delete empty child container
     *
     *  @param id   {number}                              serial number in the list of child containers
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
     *  @return {Map<string, SMCApi.IValue>}
     */
    getAllSettings: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get setting value
     *
     *  @param key  {string}                              setting name
     *  @return {SMCApi.IValue|null}
     */
    getSetting: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get all variables
     *
     *  @return Map[string, SMCApi.IValue]
     */
    getAllVariables: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get variable value
     *
     *  @param key  {string}                              variable name
     *  @return {SMCApi.IValue|null}
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
     * get thread buffer size
     *
     * @return int
     */
    getThreadBufferSize: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is configuration work
     *
     *  @return boolean
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is configuration work now (process execute any commands)
     *
     * @return boolean
     */
    isActive: function () {
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
     *  @param name {string}                              unique name for container
     *  @return void
     */
    setName: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change setting
     *
     *  @param key  {string}                              variable name
     *  @param value    {Object}                          value object (string, number, bytes)
     *  @return void
     */
    setSetting: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change variable
     *
     *  @param key  {string}                             variable name
     *  @param value  {Object}                           value object (string, number, bytes)
     *  @return void
     */
    setVariable: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove variable
     *
     *  @param key  {string}                             variable name
     *  @return void
     */
    removeVariable: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change buffer size
     *
     *  @param bufferSize   {number}                      1 is minimum
     *  @return void
     */
    setBufferSize: function (bufferSize) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change thread buffer size
     *
     * @param threadBufferSize {number} 1 is minimum
     */
    setThreadBufferSize: function (threadBufferSize) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * enable or disable configuration
     *
     *  @param enable   {boolean}                         true for enable
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
     *  @param id   {number}                              serial number in the list of Execution Contexts
     *  @return {SMCApi.CFG.IExecutionContextManaged|null}
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create execution context and bind it to this configuration
     *
     *  @param name {string}                              unique name for configuration
     *  @param type {string}                              type
     *  @param maxWorkInterval  {number}                  max work interval. if -1, no time limit. in milliseconds. default is -1
     *  @return {SMCApi.CFG.IExecutionContextManaged}
     */
    createExecutionContext: function (name, type, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * update execution context in list
     *
     * @param id    {number}                serial number in the list of execution contexts
     * @param name  {string}                unique name for configuration
     * @param type  {string}                type
     * @param maxWorkInterval {number}      max work interval. if -1, no time limit. in milliseconds
     * @return SMCApi.CFG.IExecutionContextManaged
     */
    updateExecutionContext: function (id, name, type, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * delete execution context
     *
     *  @param id   {number}                              serial number in the list of Execution Contexts
     *  @return void
     */
    removeExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get container
     *
     *  @return {SMCApi.CFG.IContainerManaged|null}
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
     *  @return {string}
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
     *  @return {boolean}     true if work
     */
    isEnable: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is context work now (execute any command)
     *
     * @return boolean
     */
    isActive: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get type
     * unique for configuration
     *
     * @return {string}     type or empty for default/any type
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IExecutionContext.prototype = SMCApi.CFG.ISourceList;

/**
 * Interface for Managed Execution Context
 *
 * @parent SMCApi.CFG.ISourceList
 */
SMCApi.CFG.IExecutionContextManaged = {

    /**
     * change name
     *
     *  @param name {string}                              unique name for configuration
     *  @return void
     */
    setName: function (name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change max work interval
     *
     *  @param maxWorkInterval  {number}                  if -1, no time limit. in milliseconds
     *  @return void
     */
    setMaxWorkInterval: function (maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * enable or disable
     *
     *  @param enable   {boolean}                         true for enable
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
     *  @param id  {number}                               serial number in the list of Execution Contexts
     *  @return {SMCApi.CFG.IExecutionContext|null}
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * insert execution context in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   {number}                                      serial number in the list of Execution Contexts
     *  @param executionContext {SMCApi.CFG.IExecutionContext}    execution context
     *  @return void
     */
    insertExecutionContext: function (id, executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * update execution context in list
     *
     * @param id    {number}                                    serial number in the list of Execution Contexts
     * @param executionContext {SMCApi.CFG.IExecutionContext}
     */
    updateExecutionContext: function (id, executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove execution context from list
     *
     *  @param id   {number}                              serial number in the list of Execution Contexts
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
     *  @param id   {number}                              serial number in the list of Managed configurations
     *  @return {SMCApi.CFG.IConfiguration|null}
     */
    getManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * insert configuration in list
     * Shifts the element currently at that position (if any) and any subsequent elements to the right (adds one to their indices).
     *
     *  @param id   {number}                                    serial number in the list of Managed configurations
     *  @param configuration    {SMCApi.CFG.IConfiguration}     configuration
     *  @return void
     */
    insertManagedConfiguration: function (id, configuration) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * update configuration in list
     *
     * @param id    {number}            serial number in the list of Managed configurations
     * @param configuration {SMCApi.CFG.IConfiguration}
     */
    updateManagedConfiguration: function (id, configuration) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove configuration from list
     *
     *  @param id   {number}                              serial number in the list of Managed configurations
     *  @return void
     */
    removeManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * change type
     *
     * @param {string}      type type name or empty for default/any type (if exist)
     */
    setType: function (type) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.IExecutionContextManaged.prototype = SMCApi.CFG.IExecutionContext;


/**
 * Interface for Source filter
 */
SMCApi.CFG.ISourceFilter = {
    /**
     * get type.
     *
     * @return SMCApi.SourceFilterType
     */
    getType: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count params
     *
     * @return number
     */
    countParams: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get param
     * params may have any types, depends on the SMCApi.SourceFilterType and id
     *
     * @param id    {number}      serial number in the list of filter params
     * @return Object depend on type:
     *          POSITION: {number[]} (n*2 elements: from - inclusive and to - exclusive for range or position and null), number (period length, if greater than zero, then defines the set within which the previous list values apply), number (count periods, determines the number of periods), number (start offset, before the first period)
     *          NUMBER: {number} (min, inclusive), number (max, inclusive)
     *          STRING_EQUAL: {boolean} (type, if true then need equals, also, not equal), string (value for compare)
     *          STRING_CONTAIN: {boolean} (type, if true then need contain, also, not contain), string (value)
     */
    getParam: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }
};

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
     * count params
     *
     * @return int
     */
    countParams: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get param
     * params may have any types, depends on the SMCApi.SourceType and id
     *
     * @param id    {number}     serial number in the list of source params
     * @return Object depend on type:
     * MODULE_CONFIGURATION: SMCApi.CFG.IConfiguration configuration (source), SMCApi.SourceGetType getType (type of get commands from source), int countLast (only for SMCApi.ContextSourceGetType.LAST. minimum 1), boolean eventDriven (is event driven)
     * EXECUTION_CONTEXT: SMCApi.CFG.IExecutionContext executionContext (source), SMCApi.SourceGetType getType (type of get commands from source), int countLast (only for SMCApi.ContextSourceGetType.LAST. minimum 1), boolean eventDriven (is event driven)
     * STATIC_VALUE: IValue (String, Number or byte array)
     * MULTIPART: null
     * CALLER_RELATIVE_NAME: string (caller level cfg name)
     */
    getParam: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * count filters
     *
     * @return number
     */
    countFilters: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get filter
     *
     * @param id {number}             serial number in the list of Filters
     * @return SMCApi.CFG.ISourceFilter
     */
    getFilter: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * Interface for Managed Source
 */
SMCApi.CFG.ISourceManaged = {
    /**
     * Create position filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param range        {number[]}        n*2 elements: from - inclusive and to - exclusive for range or position and null
     * @param period       {number}          period length, if greater than zero, then defines the set within which the previous list values apply
     * @param countPeriods {number}          determines the number of periods
     * @param startOffset  {number}          before the first period
     * @param forObject    {boolean}         if true - used for ObjectArrays, overwise for all values
     * @return SMCApi.CFG.ISourceFilter
     */
    createFilterPosition: function (range, period, countPeriods, startOffset, forObject) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Create number filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param min   {number}              inclusive
     * @param max   {number}              inclusive
     * @param fieldName   {string}        field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    createFilterNumber: function (min, max, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Create string equal filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param needEquals    {boolean}     if true then need equals, also, not equal
     * @param value         {string}      value for compare
     * @param fieldName   {string}        field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    createFilterStrEq: function (needEquals, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Create string contain filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param needContain    {boolean}     if true then need equals, also, not equal
     * @param value          {string}      value for compare
     * @param fieldName   {string}         field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    createFilterStrContain: function (needContain, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Create string contain filter and bind it to this source
     * add filter to end of current list (order = max_order + 1)
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param paths          {string}      object array paths. path - dot separated names.
     * @return SMCApi.CFG.ISourceFilter
     */
    createFilterObjectPaths: function (paths) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update Position filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id           {number}          serial number in the list
     * @param range        {number[]}        n*2 elements: from - inclusive and to - exclusive for range or position and null
     * @param period       {number}          period length, if greater than zero, then defines the set within which the previous list values apply
     * @param countPeriods {number}          determines the number of periods
     * @param startOffset  {number}          before the first period
     * @param forObject    {boolean}         if true - used for ObjectArrays, overwise for all values
     * @return SMCApi.CFG.ISourceFilter
     */
    updateFilterPosition: function (id, range, period, countPeriods, startOffset, forObject) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update Number filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id            {number}           serial number in the list
     * @param min           {number}           inclusive
     * @param max           {number}           inclusive
     * @param fieldName     {string}           field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    updateFilterNumber: function (id, min, max, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update Str Eq filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id            {number}          serial number in the list
     * @param needEquals    {boolean}         if true then need equals, also, not equal
     * @param value         {string}          value for compare
     * @param fieldName     {string}          field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    updateFilterStrEq: function (id, needEquals, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update Str Contain filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id                {number}          serial number in the list
     * @param needContain       {boolean}         if true then need equals, also, not equal
     * @param value             {string}          value for compare
     * @param fieldName         {string}          field name in ObjectArray. if empty used for simple values, overwise for ObjectArrays.
     * @return SMCApi.CFG.ISourceFilter
     */
    updateFilterStrContain: function (id, needContain, value, fieldName) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update Object Paths filter in list
     * only for MODULE_CONFIGURATION and EXECUTION_CONTEXT SourceType
     *
     * @param id                {number}          serial number in the list
     * @param paths             {string}          object array paths. path - dot separated names.
     * @return SMCApi.CFG.ISourceFilter
     */
    updateFilterObjectPaths: function (id, paths) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove filter from list
     *
     * @param id    {number}      serial number in the list of filters
     */
    removeFilter: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.ISourceManaged.prototype = SMCApi.CFG.ISource;


SMCApi.CFG.ISourceList = {

    /**
     * count sources
     *
     * @return int
     */
    countSource: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get source
     *
     * @param id    {number}                              serial number in the list of sources
     * @return {SMCApi.CFG.ISource|null}
     */
    getSource: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

SMCApi.CFG.ISourceListManaged = {

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is MODULE_CONFIGURATION
     *
     * @param configuration {SMCApi.CFG.IConfiguration}   configuration source.
     * @param getType   {SMCApi.SourceGetType}            type of get commands from source.  default NEW.
     * @param countLast {number}                          only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   {boolean}                     if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    createSourceConfiguration: function (configuration, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is EXECUTION_CONTEXT
     *
     * @param executionContext {SMCApi.CFG.IExecutionContext}   execution context source.
     * @param getType   {SMCApi.SourceGetType}                  type of get commands from source.
     * @param countLast {number}                                only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   {boolean}                           if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    createSourceExecutionContext: function (executionContext, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is STATIC_VALUE
     *
     * @param value {SMCApi.IValue}                       value (String, Number or byte array)
     * @return SMCApi.CFG.ISourceManaged
     */
    createSourceValue: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of list (order = max_order + 1)
     * created ContextSourceType is MULTIPART
     *
     *  @return SMCApi.CFG.ISourceManaged
     */
    createSource: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create source and bind it to this execution context
     * add source to end of current list (order = max_order + 1)
     * created ContextSourceType is OBJECT_ARRAY
     *
     * @param value {SMCApi.ObjectArray}              value
     * @param fields {string[]}                  list of field (comma separated list of paths).
     *  @return SMCApi.CFG.ISourceManaged
     */
    createSourceObjectArray: function (value, fields) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update source in list
     * ContextSourceType is MODULE_CONFIGURATION
     *
     * @param id {number}                               serial number in the list of sources
     * @param configuration {SMCApi.CFG.IConfiguration} configuration source.
     * @param getType   {SMCApi.SourceGetType}          type of get commands from source.  default NEW.
     * @param countLast {number}                        only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   {boolean}                   if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    updateSourceConfiguration: function (id, configuration, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update source in list
     * created ContextSourceType is EXECUTION_CONTEXT
     *
     * @param id {number}                                       serial number in the list of sources
     * @param executionContext {SMCApi.CFG.IExecutionContext}   execution context source.
     * @param getType   {SMCApi.SourceGetType}                  type of get commands from source.
     * @param countLast {number}                                only for ContextSourceGetType.LAST. minimum 1. default 1.
     * @param eventDriven   {boolean}                           if true, then source is event driven. default is false.
     * @return SMCApi.CFG.ISourceManaged
     */
    updateSourceExecutionContext: function (id, executionContext, getType, countLast, eventDriven) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update source in list
     * created ContextSourceType is STATIC_VALUE
     *
     * @param id {number}                              serial number in the list of sources
     * @param value {SMCApi.IValue}                    value (String, Number or byte array)
     * @return SMCApi.CFG.ISourceManaged
     */
    updateSourceValue: function (id, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * Update source in list
     * created ContextSourceType is OBJECT_ARRAY
     *
     * @param id {number}                               serial number in the list of sources
     * @param value {SMCApi.ObjectArray}                value
     * @param fields {string[]}                         list of field (comma separated list of paths).
     * @return SMCApi.CFG.ISourceManaged
     */
    updateSourceObjectArray: function (id, value, fields) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove source from list
     *
     * @param id    {number}                              serial number in the list of sources
     * @return void
     */
    removeSource: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get managed source list
     *
     * @param id {number}             serial number in the list of sources
     * @return SMCApi.CFG.ISourceListManaged or null
     */
    getSourceListManaged: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }
    ,

    /**
     * get managed source
     *
     * @param id {number}               serial number in the list of sources
     * @return SMCApi.CFG.ISourceManaged or null
     */
    getSourceManaged: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
SMCApi.CFG.ISourceListManaged.prototype = SMCApi.CFG.ISourceList;

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
     *  @return byte[]
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
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    start: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * main method. call every time when need execute
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @param executionContextTool {SMCApi.ExecutionContextTool}
     *  @return void
     */
    process: function (configurationTool, executionContextTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * call then need update
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    update: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * call once per process on stop
     *
     *  @param configurationTool    {SMCApi.ConfigurationTool}
     *  @return void
     */
    stop: function (configurationTool) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};

/**
 * main configuration tool
 *
 * @parent {SMCApi.CFG.IConfiguration}
 */
SMCApi.ConfigurationTool = {

    /**
     * change variable
     *
     *  @param key  {string}                             variable name
     *  @param value    {object}                           value object (string, number, bytes)
     *  @return void
     */
    setVariable: function (key, value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is variable has changed from last execution or last check
     * usfull for check changes from external (processes or user)
     *
     *  @param key  {string}                             variable name
     *  @return boolean
     */
    isVariableChanged: function (key) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove variable
     *
     *  @param key  {string}                             variable name
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
     * @param id    {number}                              serial number in the list of Execution Contexts
     * @return {SMCApi.CFG.IExecutionContext|null}
     */
    getExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get container
     *
     *  @return {SMCApi.CFG.IContainerManaged|null}
     */
    getContainer: function () {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * logger trace
     *
     * @param text {string}           text
     */
    loggerTrace: function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * logger debug
     *
     * @param text {string}           text
     */
    loggerDebug: function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * logger info
     *
     * @param text {string}           text
     */
    loggerInfo: function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * logger warn
     *
     * @param text {string}           text
     */
    loggerWarn: function (text) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * logger error
     *
     * @param text {string}           text
     */
    loggerError: function (text) {
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
     *  @param value    {Object}                          object (string, number, bytes)
     *  @return void
     */
    addMessage: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * emit error message
     *
     *  @param value    {Object}                          object (string, number, bytes)
     *  @return void
     */
    addError: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * emit log message
     *
     *  @param value    {string}
     *  @return void
     */
    addLog: function (value) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get count commands in source
     *
     *  @param sourceId {number}                          serial number in the list of Sources
     *  @return number
     */
    countCommands: function (sourceId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get count commands (all) for managed execution context
     *
     * @param executionContext  {SMCApi.CFG.IExecutionContextManaged}     managed execution context
     * @return count
     */
    countCommandsFromExecutionContext: function (executionContext) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Actions from source (only DATA messages)
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param sourceId     {number}                      serial number in the list of Sources
     *  @param fromIndex    {number}                      start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param toIndex      {number}                      end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return SMCApi.IAction[]
     */
    getMessages: function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Commands from source
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     *  @param sourceId     {number}                      serial number in the list of Sources
     *  @param fromIndex    {number}                      start serial number in the list of commands in source (exclusive). if -1 then get all. default is -1.
     *  @param toIndex      {number}                      end serial number in the list of commands in source (inclusive). if -1 then get all. default is -1.
     *  @return SMCApi.ICommand[]
     */
    getCommands: function (sourceId, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get Commands from managed execution context
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     *
     * @param executionContext {SMCApi.CFG.IExecutionContextManaged}  managed execution context
     * @param fromIndex {number}                          start serial number in the list of commands
     * @param toIndex   {number}                          end serial number in the list of commands
     * @return {SMCApi.ICommand[]}
     */
    getCommandsFromExecutionContext: function (executionContext, fromIndex, toIndex) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * is Process Actions has errors
     *
     *  @param action   {SMCApi.IAction}
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
     * @return SMCApi.CFG.IModule[]
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
     * @param id    {number}                              serial number in the list of Managed configurations
     * @return {SMCApi.CFG.IConfigurationManaged|null}
     */
    getManagedConfiguration: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * create configuration and add it in list of managed configurations
     *
     * @param id    {number}                              index at which the specified element is to be inserted
     * @param container    {SMCApi.CFG.IContainer}        container
     * @param module    {SMCApi.CFG.IModule}              module
     * @param name  {string}                              unique name for configuration
     * @return SMCApi.CFG.IConfigurationManaged
     */
    createConfiguration: function (id, container, module, name) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * remove managed configuration
     *
     * @param id    {number}                              serial number in the list of Managed configurations
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
     *  @param type       {SMCApi.CommandType}              type of command
     *  @param managedId  {number}                          serial number in the list of Managed execution contexts
     *  @param values     {Object[]}                        list of values for create dummy messages from this process, or null
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
     *  @param type          {SMCApi.CommandType}       type of command
     *  @param managedIds    {number[]}                 list of serial numbers in the list of Managed execution contexts
     *  @param values        {Object[]}            list of values for create dummy messages from this process, or null
     *  @param waitingTacts  {number}                   if it is necessary that the new thread first wait for the specified time (in tacts). if 0 then using data from current thread. default is 0.
     *  @param maxWorkInterval {number}                 define max work interval of new thread (in tacts). if -1 then no limit. default is -1.
     *  @return {number}  id of thread
     */
    executeParallel: function (type, managedIds, values, waitingTacts, maxWorkInterval) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * check is thread alive
     *
     *  @param threadId  {number}                       id thread
     *  @return boolean
     */
    isThreadActive: function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param threadId  {number}                       id thread. if 0 then using data from current thread. default is 0.
     *  @param managedId {number}                       serial number in the list of Managed execution contexts. default is 0.
     *  @return {SMCApi.IAction[]} only DATA messages
     */
    getMessagesFromExecuted: function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get data from managed execution context
     * who receive commands from this process
     *
     *  @param threadId  {number}                        id thread. if 0 then using data from current thread. default is 0.
     *  @param managedId {number}                       serial number in the list of Managed execution contexts. default is 0.
     *  @return SMCApi.ICommand[]
     */
    getCommandsFromExecuted: function (threadId, managedId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * after executeParallel and work with him, need to release thread
     *
     *  @param threadId   {number}                      id thread
     *  @return void
     */
    releaseThread: function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * after executeParallel and work with him, need to release thread
     * if thread work - not stop it
     *
     * @param threadId  {number}          id thread
     */
    releaseThreadCache: function (threadId) {
        throw new SMCApi.ModuleException('function not implemented');
    },

    /**
     * get managed execution context
     *
     * @param id    {number}                                        serial number in the list of Managed execution contexts
     * @return {SMCApi.CFG.IExecutionContext|null}
     */
    getManagedExecutionContext: function (id) {
        throw new SMCApi.ModuleException('function not implemented');
    }

};
