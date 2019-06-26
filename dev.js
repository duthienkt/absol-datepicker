import DatePicker from '.';

import DebugTask from 'absol-acomp/js/DebugTask';

if ('absol' in window) {
    absol.Dom.ShareInstance.install(/calendar/,DatePicker.core);
}
else {
    window.absol = DatePicker;
}

DebugTask.start();