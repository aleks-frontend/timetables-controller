function timetablesController() {
    const timetables = document.querySelectorAll('[data-timetable-js-hook="container"]');

    for (const [index, timetable] of timetables.entries()) {
        const targetContainer = document.querySelectorAll('[data-timetable-js-hook="target-container"]')[index];
        const heading = timetable.dataset.timetableHeading;
        const title = timetable.dataset.timetableTitle;
        const handleEmptyColumns = timetable.dataset.timetableHandleEmptyColumns;
        const rows = timetable.querySelectorAll('[data-timetable-js-hook="row"]');
        const rowsData = [];
        const emptyColumns = {};
        const emptyCellClass = 'empty-cell';

        // Setting up the data structure
        for (const row of rows) {
            const time = row.dataset.timetableRowTime || 'no time set';
            const cells = row.querySelectorAll('[data-timetable-js-hook="cell"]');
            const rowData = {
                time: time,
                days: new Array(7).fill(emptyCellClass)
            };

            for (const cell of cells) {
                const type = cell.dataset.type;
                const day = cell.dataset.day || 0;
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

                if (rowData.days[cellData.day] !== emptyCellClass) {
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
        const renderGridInner = (bgImageUrl, modifiers = '') => {
            const modifierClasses = modifiers.split(' ').map(modifier => `grid__item--${modifier}`).join(' ');
            return `<div class="grid__inner ${modifierClasses}" style="background-image: url(${bgImageUrl});"></div>`;
        };

        const renderMultipleActivities = (activities) => {
            // checking if no activties were set yet
            if (!activities) return '';
            const types = [];

            const multiActivityHTML = activities.map(activity => {
                const { type, color, text } = activity;

                // Adding types or custom activity text to types array so we can check for duplicates later
                if (type !== 'custom-activity') {
                    types.push(type);
                } else {
                    types.push(text);
                }

                switch (activity.type) {
                    case 'fx':
                        return renderGridInner('https://files.outfit.io/media_library_items/200881/fx30.svg');
                    case 'barre':
                        return renderGridInner('https://files.outfit.io/media_library_items/200879/les-mills-barre-black.svg');
                    case 'strong-zumba':
                        return renderGridInner('https://files.outfit.io/media_library_items/200878/strong-zumba.svg');
                    case 'zumba':
                        return renderGridInner('https://files.outfit.io/media_library_items/200856/zumba-fitness.svg');
                    case 'game-on':
                        return renderGridInner('https://files.outfit.io/media_library_items/200867/game-on.svg');
                    case 'metafit':
                        return renderGridInner('https://files.outfit.io/media_library_items/205052/meta-fit-bodyweight-training.svg', 'metafit');
                    case 'lesmills-bodypump':
                        return renderGridInner('https://files.outfit.io/media_library_items/200873/les-mills-bodypump-white.svg', 'lesmills');
                    case 'lesmills-bodybalance':
                        return renderGridInner('https://files.outfit.io/media_library_items/200874/les-mills-bodybalance-white.svg', 'lesmills');
                    case 'lesmills-bodycombat':
                        return renderGridInner('https://files.outfit.io/media_library_items/200875/les-mills-bodycombat-white.svg', 'lesmills');
                    case 'lesmills-rpm':
                        return renderGridInner('https://files.outfit.io/media_library_items/200870/les-mills-rpm.svg', 'lesmills');
                    case 'lesmills-cxwork':
                        return renderGridInner('https://files.outfit.io/media_library_items/200869/les-mills-cxworx-white.svg', 'lesmills');
                    case 'lesmills-bodyattack':
                        return renderGridInner('https://files.outfit.io/media_library_items/200876/les-mills-bodyattack-white.svg', 'lesmills');
                    case 'lesmills-bodyjam':
                        return renderGridInner('https://files.outfit.io/media_library_items/200864/les-mills-bodyjam-white.svg', 'lesmills');
                    case 'lesmills-bodystep':
                        return renderGridInner('https://files.outfit.io/media_library_items/200872/les-mills-bodystep-white.svg', 'lesmills');
                    case 'lesmills-grit':
                        return renderGridInner('https://files.outfit.io/media_library_items/200855/les-mills-grit-white.svg', 'lesmills');
                    case 'custom-activity':
                        return `<div class="grid__inner" style="background: ${activity.color}">${activity.text}</div>`;
                    default:
                        return '<div class="grid__inner"></div>';
                }
            }).join('');

            // Checking if same activities were added in the same multiple activity block
            if ((new Set(types)).size !== types.length) {
                return '<div class="grid__inner" style="background: red; color: #000;">No duplicates allowed</div>';
            } else {
                return multiActivityHTML;
            }
        };

        // Updating emptyColumns object to add a different style for the cells that are a part of empty column
        for (const rowData of rowsData) {
            for (const [index, day] of rowData.days.entries()) {
                if (day === emptyCellClass) {
                    emptyColumns[index] = emptyColumns[index] ? emptyColumns[index] + 1 : 1;
                }
            }
        }

        const renderGridItemWithLogo = (bgImageUrl, modifiers = '') => {
            const modifierClasses = modifiers.split(' ').map(modifier => `grid__item--${modifier}`).join(' ');
            return `<div class="grid__item grid__item--cell ${modifierClasses === 'grid__item--' ? '' : modifierClasses }" style="background-image: url(${bgImageUrl});"></div>`;
        };

        const renderGridItemWithText = (colorHex, text) => {
            return `<div class="grid__item grid__item--cell" style="background-color:${colorHex};">${text}</div>`;
        };

        const renderRows = () => {
            return rowsData.map(rowData => {
                return rowData.days.map((cell, index) => {
                    // Logic for showing the time cell at the begining of each row
                    const timeCell = index === 0 ? `<div class="grid__item grid__item--cell grid__item--time">${rowData.time}</div>` : '';
                    const gridItemCellClass = 'grid__item grid__item--cell';

                    if (cell === emptyCellClass) {
                        const isInEmptyColumn = emptyColumns[index] === rowsData.length ? ' grid__item--emptyColumn' : '';

                        return `${timeCell}<div class="grid__item grid__item--cell${isInEmptyColumn}"></div>`;
                    } else if (cell === 'error-cell') {
                        return `${timeCell}<div class="grid__item grid__item--error grid__item--cell">More than one activity added</div>`;
                    } else {
                        switch (cell.type) {
                            case 'custom-activity':
                                return `${timeCell}<div class="${gridItemCellClass}" style="background: ${cell.color}">${cell.text}</div>`;
                            case 'fx':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200881/fx30.svg', 'preset')}`;
                            case 'barre':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200879/les-mills-barre-black.svg', 'preset')}`;
                            case 'strong-zumba':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200878/strong-zumba.svg', 'preset')}`;
                            case 'zumba':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200856/zumba-fitness.svg', 'preset')}`;
                            case 'game-on':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200867/game-on.svg', 'preset')}`;
                            case 'metafit':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/205052/meta-fit-bodyweight-training.svg', 'preset metafit')}`;
                            case 'lesmills-bodypump':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200873/les-mills-bodypump-white.svg', 'preset lesmills')}`;
                            case 'lesmills-bodybalance':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200874/les-mills-bodybalance-white.svg', 'preset lesmills')}`;
                            case 'lesmills-bodycombat':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200875/les-mills-bodycombat-white.svg', 'preset lesmills')}`;
                            case 'lesmills-rpm':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200870/les-mills-rpm.svg', 'preset lesmills')}`;
                            case 'lesmills-cxwork':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200869/les-mills-cxworx-white.svg', 'preset lesmills')}`;
                            case 'lesmills-bodyattack':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200876/les-mills-bodyattack-white.svg', 'preset lesmills')}`;
                            case 'lesmills-bodyjam':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200864/les-mills-bodyjam-white.svg', 'preset lesmills')}`;
                            case 'lesmills-bodystep':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200872/les-mills-bodystep-white.svg', 'preset lesmills')}`;
                            case 'lesmills-grit':
                                return `${timeCell}${renderGridItemWithLogo('https://files.outfit.io/media_library_items/200855/les-mills-grit-white.svg', 'preset lesmills')}`;
                            case 'aqua-aerobics':
                                return `${timeCell}${renderGridItemWithText('#93d2f1', 'AQUA AEROBICS')}`;
                            case 'aqua-for-all':
                                return `${timeCell}${renderGridItemWithText('#d1e8f8', 'AQUA FOR ALL')}`;
                            case 'silver-sneakers':
                                return `${timeCell}${renderGridItemWithText('#e6e7e9', 'SILVER SNEAKERS')}`;
                            case 'senior-movement-to-music':
                                return `${timeCell}${renderGridItemWithText('#ffda99', 'SENIOR MOVEMENT TO MUSIC')}`;
                            case 'yoga':
                                return `${timeCell}${renderGridItemWithText('#d8e7a6', 'YOGA')}`;
                            case 'fit-and-fab':
                                return `${timeCell}${renderGridItemWithText('#e6e7e9', 'FIT AND FABULOUS')}`;
                            case 'cycle':
                                return `${timeCell}${renderGridItemWithText('#cedae6', 'CYCLE')}`;
                            case 'sprint':
                                return `${timeCell}${renderGridItemWithText('#ffcdb4', 'SPRINT')}`;
                            case 'boxing':
                                return `${timeCell}${renderGridItemWithText('#fea49b', 'BOXING')}`;
                            case 'sh-bam':
                                return `${timeCell}${renderGridItemWithText('#eaf2b7', 'SH-BAM')}`;
                            case 'aqua-deep':
                                return `${timeCell}${renderGridItemWithText('#eaf2b7', 'AQUA DEEP')}`;
                            case 'multiple-activity':
                                return `${timeCell}<div class="grid__item grid__item--multiple grid__item--cell">${renderMultipleActivities(cell.activities)}</div>`;
                            default:
                                return `${timeCell}<div class="grid__item"></div>`;
                        }
                    }
                }).join('')
            }).join('');
        };

        const renderDaysLabels = () => {
            const daysLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

            return daysLabels.map((label, index) => `<div class="grid__item grid__item--day ${emptyColumns[index] === rowsData.length ? ' grid__item--emptyColumn' : ''}">${label}</div>`).join('');
        };

        const renderHeading = () => {
            if (heading === '') {
                return '';
            } else {
                return `<div class="grid__item grid__item--heading">
<div class="textFit--heading">${heading}</div>
  </div>`;
            }
        };

        // Getting the total count of empty columns in order to set the grid-template-columns value later
        const emptyColumnsCount = Object.keys(emptyColumns).reduce((total, key) => emptyColumns[key] === rowsData.length ? ++total : total, 0);

        targetContainer.innerHTML = `
<div 
class="grid ${handleEmptyColumns === 'hide' ? 'hide-empty-columns' : 'show-grey-empty-columns'}" 
style="grid-template-columns: repeat(${handleEmptyColumns === 'hide' ? (8 - emptyColumnsCount) : 8}, 1fr);"
>
${renderHeading()}
<div class="grid__item grid__item--title" data-max-line="css">${title}</div>
<div class="grid__item grid__item--day grid__item--time">TIME</div>
${renderDaysLabels()}
${renderRows()}
  </div>`;

        // TextFit needs to be initialized once again when 
        // the dynamic table is generated and inserted into the DOM
        TextFit.fit({
            selector: '.textFit'
        });
    }
}
