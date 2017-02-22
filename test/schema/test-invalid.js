module.exports = function(Model) {
    
    return(data) => new Model(data)
        .validate()
        .then(
            () => { throw new Error('validation should not have succeeded'); },
            () => {}
        );
};