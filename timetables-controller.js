function timetablesController() {
    const timetables = document.querySelectorAll('[data-timetable-js-hook="container"]');

    for (const [index, timetable] of timetables.entries()) {
        const targetContainer = document.querySelectorAll('[data-timetable-js-hook="target-container"]')[index];
        const heading = timetable.dataset.timetableHeading;
        const title = timetable.dataset.timetableTitle;
        const showSunday = timetable.dataset.timetableShowSunday === '' ? 'show' : timetable.dataset.timetableShowSunday;
        const rows = timetable.querySelectorAll('[data-timetable-js-hook="row"]');
        const rowsData = [];
        const emptyCellClass = 'empty-cell';

        // Setting up the data structure
        for (const row of rows) {
            const time = row.dataset.timetableRowTime || 'no time set';
            const cells = row.querySelectorAll('[data-timetable-js-hook="cell"]');
            const rowData = {
                time: time,
                days: new Array(showSunday === 'show' ? 7 : 6).fill(emptyCellClass)
            };

            for (const cell of cells) {
                const type = cell.dataset.type;
                const day = cell.dataset.day || 1;
                const cellData = { type, day };

                if (type === 'multiple-activity') {
                    const activities = cell.querySelectorAll('[data-timetable-js-hook="multi-cell-inner"]');
                    const activitiesData = [];

                    for (const activity of activities) {
                        const type = activity.dataset.type;
                        const activityData = {};

                        if (type === 'custom-activity') {
                            activityData.color = activity.dataset.color;
                            activityData.text = activity.innerText;
                        }

                        activityData.type = type;
                        activitiesData.push(activityData);
                        cellData.activities = activitiesData;
                    }
                }

                if (cellData.day === '6' && showSunday === 'hide') {
                    alert('Set Sunday to \'show in order to add activity for that day.');
                } else if (rowData.days[cellData.day] !== emptyCellClass) {
                    rowData.days.splice(cellData.day, 1, 'error-cell')
                } else {
                    if (type === 'custom-activity') {
                        cellData.color = cell.dataset.color;
                        cellData.text = cell.innerText;
                    }

                    rowData.days.splice(cellData.day, 1, cellData)
                }
            }

            rowsData.push(rowData);
        }

        // Render methods
        const renderMultipleActivities = (activities) => {          
            // checking if no activties were set yet
            if ( !activities ) return '';

            const multiActivityHTML = activities.map(activity => {
                switch (activity.type) {
                    case 'fx':
                        return '<div class="grid__inner" style="background-image: url(https://files.outfit.io/media_library_items/200881/fx30.svg);"></div>';
                    case 'barre':
                        return '<div class="grid__inner" style="background-image: url(https://files.outfit.io/media_library_items/200879/les-mills-barre-black.svg);"></div>';
                    case 'strong-zumba':
                        return '<div class="grid__inner" style="background-image: url(https://files.outfit.io/media_library_items/200878/strong-zumba.svg);"></div>';
                    case 'custom-activity':
                        return `<div class="grid__inner" style="background: ${activity.color}">${activity.text}</div>`;
                    default:
                        return '<div class="grid__inner"></div>';
                }
            }).join('');

            return multiActivityHTML;
        };

        const renderRows = () => {
            return rowsData.map(rowData => {
                return rowData.days.map((cell, index) => {
                    // Logic for showing the time cell at the begining of each row
                    const timeCell = index === 0 ? `<div class="grid__item">${rowData.time}</div>` : '';

                    if (cell === emptyCellClass) {
                        return `${timeCell}<div class="grid__item"></div>`;
                    } else if (cell === 'error-cell') {
                        return `${timeCell}<div class="grid__item grid__item--error">More than one activity added</div>`;
                    } else {
                        switch (cell.type) {
                            case 'custom-activity':
                                return `${timeCell}<div class="grid__item" style="background: ${cell.color}">${cell.text}</div>`;
                            case 'fx':
                                return `${timeCell}<div class="grid__item grid__item--preset" style="background-image: url(https://files.outfit.io/media_library_items/200881/fx30.svg);"></div>`;
                            case 'barre':
                                return `${timeCell}<div class="grid__item grid__item--preset" style="background-image: url(https://files.outfit.io/media_library_items/200879/les-mills-barre-black.svg);"></div>`;
                            case 'strong-zumba':
                                return `${timeCell}<div class="grid__item grid__item--preset" style="background-image: url(https://files.outfit.io/media_library_items/200878/strong-zumba.svg);"></div>`;
                            case 'multiple-activity':
                                return `${timeCell}<div class="grid__item grid__item--multiple">${renderMultipleActivities(cell.activities)}</div>`;
                            default:
                                return `${timeCell}<div class="grid__item"></div>`;
                        }
                    }
                }).join('')
            }).join('');
        };

        const renderDaysLabels = () => {
            const sixDaysRow = `
            <div class="grid__item">TIME</div>
            <div class="grid__item">MON</div>
            <div class="grid__item">TUE</div>
            <div class="grid__item">WED</div>
            <div class="grid__item">THR</div>
            <div class="grid__item">FRI</div>
            <div class="grid__item">SAT</div>`;
            const sevenDaysRow = sixDaysRow + '<div class="grid__item">SUN</div>';
            return (showSunday === 'show' ? sevenDaysRow : sixDaysRow);
        };

        targetContainer.innerHTML = `
            <div class="grid" style="grid-template-columns: repeat(${showSunday === 'show' ? '8' : '7'}, 1fr);">
                <div class="grid__item grid__item--heading">${heading}</div>
                <div class="grid__item grid__item--title">${title}</div>
                ${renderDaysLabels()}
                ${renderRows()}
            </div>`;
    }
}
