const app = require('tns-core-modules/application');
const fs = require('tns-core-modules/file-system');
const observable = require('data/observable');
const permissions = require('nativescript-permissions');

function HomeViewModel() {
    const env = android.os.Environment;
    const downloadDirPath = env.getExternalStoragePublicDirectory(
        env.DIRECTORY_DOWNLOADS,
    );
    let filePath = `${downloadDirPath}/dictionary.txt`;
    let isFileLoaded = true;
    let file;
    let lastTappedItem;
    let isLongPress = false;
    let isAdd = false;

    app.on(app.suspendEvent, saveFile);

    app.on(app.exitEvent, saveFile);

    app.on(app.lowMemoryEvent, () => {
        alert('Running out of memory...');
        saveFile();
    });

    app.on(app.uncaughtErrorEvent, (args) => {
        console.log('app uncaught error', args.error);
    });
    permissions.requestPermission([
        android.Manifest.permission.READ_EXTERNAL_STORAGE,
        android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
    ]).then(loadFile);

    function loadFile() {
        const path = viewModel.get('searchTerm') || filePath;
        if (!fs.File.exists(path)) {
            isFileLoaded = false;

            viewModel.set('searchTerm', path);
            return alert(`File not found at ${path
            }. Type the correct path to your file.`);
        }

        isFileLoaded = true;
        viewModel.set('searchTerm', '');
        file = fs.File.fromPath(path);
        file.readText()
            .then(res => updateLines(res))
            .catch(err => console.log('file read err', err));
    }
    function saveFile() {
        if (!file) return console.log('File not loaded');

        const text = viewModel.get('items')
            .map(({ value, isStrong }) => isStrong ? `!${value}` : value)
            .join('\n');

        file.writeText(text)
            .catch(err => console.log('file save error', err));
    }

    const viewModel = observable.fromObject({
        isStrong: false,
        searchTerm: '',
        items: [],
        filteredItems: [],
        searchHint: 'word search',
        searchInputType: 'url',
        onAddTap: function (args) {
            if (!isFileLoaded) return loadFile();

            const searchEl = args.object.page.getViewById('search');

            if (isAdd) {
                isAdd = false;
                viewModel.set('searchHint', 'word search');
                return searchEl.dismissSoftInput();
            }

            isAdd = true;
            viewModel.set('searchHint', 'type your new word');
            searchEl.focus();
        },
        onStrongToggle: function (args) {
            const isStrong = !viewModel.get('isStrong');
            const items = viewModel.get('items')
                .filter(item => isStrong ? item.isStrong : true);

            viewModel.set('filteredItems', items);
            viewModel.set('isStrong', isStrong);
            viewModel.set('searchTerm', '');
            args.object.page.getViewById('search').dismissSoftInput();
        },
        onItemDoubleTap: function (args) {
            const context = args.object.bindingContext;
            const items = context.get('items')
                .filter(({ index }) => index !== lastTappedItem.index)
                .map((item, index) => ({ ...item, index: index + 1 }));

            context.set('items', items);
            context.set('filteredItems', items);
        },

        onItemLongPress: function () {
            isLongPress = true;
        },

        onSearchEnterKeyPress: function () {
            const lineNo = viewModel.get('searchTerm');
            const items = viewModel.get('items');

            if (lineNo <= items.length) {
                items.splice(lineNo, 0, { ...lastTappedItem, index: lineNo });
                const newItems = items.map((item, index) => ({
                    ...item, index: index + 1,
                }));
                viewModel.set('items', newItems);
                viewModel.set('filteredItems', newItems);
            }

            viewModel.set('searchInputType', 'url');
            viewModel.set('searchHint', 'word search');
            viewModel.set('searchTerm', '');
        }
    });

    function handleItemLongPress(args) {
        viewModel.set('searchInputType', 'number');
        viewModel.set('searchHint', 'line number to copy to');
        args.object.page.getViewById('search').focus();
    }

    function updateLines(text) {
        const items = text.split('\n').map((line, index) => {
            const isStrong = line[0] === '!';
            return ({
                index: index + 1,
                value: isStrong ? line.substr(1) : line,
                isStrong,
            })
        });
        viewModel.set('items', items);
        viewModel.set('filteredItems', items);
    }

    viewModel.on(observable.Observable.propertyChangeEvent, (propChangeData) => {
        if (propChangeData.propertyName === 'searchTerm'
            && viewModel.get('searchInputType') !== 'number'
            && !isAdd
        ) {
            const term = propChangeData.value.toLowerCase();
            const items = viewModel.items.filter(({ value }) =>
                value.toLowerCase().indexOf(term) > -1,
            );
            viewModel.set('filteredItems', items);
            viewModel.set('isStrong', false);
        }
    });

    return viewModel;
}

module.exports = HomeViewModel;
