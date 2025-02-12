//TODO use my mongo functions to do upsert, insert, find for STATE etc
//use immutable
import update from 'immutability-helper'
import {
    moveEntry,
    withoutEntry,
    getObjectsByKey,
    saveToSessionStorage,
    saveToSession,
    restoreFromSession
} from "../utils/trickBox";
import {initContent} from "../utils/tools";
import uuidv4 from 'uuid/v4';
import globals from '../utils/globals';
import {initData} from "../utils/types";


function updateLinksInChapters_mutate(chapters) {
    chapters.forEach(chapter => {
        let continue_links = [];
        let answer_links = [];
        chapter.elements.forEach(elem => {
            if (elem.type === globals.EDIT_QUIZ || elem.type === globals.EDIT_CONTINUE_ELEMENT) {

                if (elem.content.answers) {
                    const answeractions = elem.content.answers
                        .filter(answer => answer.action != null)
                        .map(answerWithLink => answerWithLink.action)
                    answer_links.push(...answeractions)
                }

                else if (elem.content.action) {
                    continue_links.push(elem.content.action);
                }

                const links = [...continue_links, ...answer_links]
                //if a chapter was deleted before
                // .filter(link => allChapterIDs.includes(link.chapterId));
                chapter.links = links.map(function (link) {
                    return {
                        eventId: uuidv4(),
                        chapterId: link
                    }
                });
            }
        })
    });

    return chapters;
}


const actions = function (store) { //store for async stuff
    return {
        //state variable gets inject into the action functions somehow through the connect(maptoprops, action)
        onToggleEditMode(state) {
            return update(state, {isEditMode: {$set: !state.isEditMode}})
        },

        restoreStateFromSession(state) {
            return {...state, ...restoreFromSession()}
        },

        mergeStoreWithSessionStorage(state) {
            const clone = JSON.parse(JSON.stringify(state));
            //deep searches data and returns 1D array with objects that have an ID property
            //by reference!
            const allWithID = getObjectsByKey([clone], 'id');
            const sessionKeys = Object.keys(sessionStorage).filter(key => key.includes(globals.SESSIONSTORAGE_KEY))
            //get
            sessionKeys.forEach(key => {
                const matchFromState = allWithID.find(el => globals.SESSIONSTORAGE_KEY + el['id'] === key)
                console.log(matchFromState, "FOUND in STATE!", key)
                if (matchFromState) {
                    const matchFromSession = JSON.parse(sessionStorage.getItem(key));
                    console.log(matchFromSession, "FOUND in SESSION!", key);

                    if (matchFromSession.timestamp >= matchFromState.timestamp) {
                        console.log('Compare two Items session - state', matchFromSession, matchFromState);

                        matchFromState.content = matchFromSession.content;

                    }
                }
            });

            console.log('new store version', clone)
            return clone;
        },

        instantUpdateElements(state, shouldUpdateNow = false) {
            return update(state, {
                shouldInstantUpdate: {$set: shouldUpdateNow}
            })
        },

        setIdToken(state, idtoken) {
            return update(state, {
                user: {
                    idToken: {$set: idtoken}
                }
            })
        },

        onDeleteChapter(state, chapterId) {
            const clone = JSON.parse(JSON.stringify(state));
            const chapters = clone.chapters.filter(chapter => chapter.id !== chapterId);

            //remove links
            chapters.forEach(chapter => {
                chapter.links = chapter.links
                    .filter(link => link.chapterId !== chapterId)
            });

            clone.chapters = chapters;
            return clone
        },

        createNewProject(state) {
            saveToSession(state)

            const preserve = {
                user: state.user,
                author: state.user.name
            }
            //initData overrides current state, except non-Lesson related data (eg userinfo)
            return {...state, ...initData, ...preserve}
        },

        setProjectInLessonMaker(state, projectData) {
            if (projectData.data) {
                projectData.chapters = projectData.data.chapters;
            }

            return {...state, ...projectData};
        },

        remixProject(state, projectData, user = {name: null, uid: null, idToken: null}) {
            const clone = JSON.parse(JSON.stringify(projectData));
            clone.user = user;
            clone.chapters = projectData.data.chapters;
            clone.author = user.name + " - remixed content from " + projectData.author;
            clone.contentId = uuidv4()
            return clone;
        },

        onUpdateUserInfo(state, firebaseLoginObj) {

            const {user} = firebaseLoginObj;
            saveToSessionStorage(globals.SESSIONSTORAGE_KEY + 'user', user);
            return update(state, {user: {$set: user}})
        },

        onChangeIconName(state, value) {
            return update(state, {iconName: {$set: value}})
        },

        onChangeProjectTitle(state, value) {
            return update(state, {title: {$set: value}})
        },

        onChangeProjectDescription(state, value) {
            return update(state, {description: {$set: value}})
        },

        onChangeProjectTags(state, tags) {
            return update(state, {tags: {$set: tags}})
        },

        onChangeContent(state, id, value, elementChapter) {
            //more verbose, but performant (instead of Json.stringify)

            saveToSession(state);

            const currentChapterIdx = state.chapters.findIndex(chapter => chapter.id === elementChapter);

            //chapter was deleted
            if (!state.chapters[currentChapterIdx]) {
                return state
            }

            let elements = state.chapters[currentChapterIdx].elements;

            const elemIdx = elements.findIndex(el => el.id === id);
            if (!elements[elemIdx]) {
                console.log('no element found on change content -- maybe handlechange fired, but element in Chapter that is not active')
                return
            }

            return update(state, {
                chapters: {
                    [currentChapterIdx]: {
                        elements: {
                            [elemIdx]: {
                                content: {$set: value},
                                timestamp: {$set: Date.now()}
                            }
                        }
                    }
                }
            })
        },

        onChangeActiveChapter(state, id) {
            console.log(id)
            const index = state.chapters.findIndex(chapter => chapter.id.toString() === id.toString());
            return update(state, {activeChapterIndex: {$set: index}})
        },

        onChangeChapterTitle(state, value, id) {
            const clone = JSON.parse(JSON.stringify(state));
            let chap = clone.chapters[state.activeChapterIndex];
            chap.title = value;
            chap.timestamp = Date.now();
            return clone
        },
        //usually called after onChangeContent adds new actions
        updateChapterLinks(state) {
            const clone = JSON.parse(JSON.stringify(state));
            // const allChapterIDs = clone.chapters.map(chap => chap.id)
            clone.chapters = updateLinksInChapters_mutate(clone.chapters);
            return clone;
        },

        handleAddChapter(state, uid, title = "|| Untitled Chapter ||") {
            const clone = JSON.parse(JSON.stringify(state));

            const activeChapter = clone.chapters[state.activeChapterIndex];
            // activeChapter.links.push({
            //     eventId: uuidv4(),
            //     chapterId: uid
            // });
            clone.chapters[state.activeChapterIndex] = activeChapter;

            clone.chapters.push(
                {
                    id: uid,
                    title,
                    elements: [],
                    // linkIdx: [1],
                    links: [],
                    timestamp: Date.now()
                }
            );

            clone.chapters = updateLinksInChapters_mutate(clone.chapters)

            return clone
        },


        onMoveElement(state, id, direction) {
            let elements = state.chapters[state.activeChapterIndex].elements;
            const entryIdx = elements.findIndex(el => el.id === id);

            return update(state, {
                chapters: {
                    [state.activeChapterIndex]: {
                        elements: {$set: moveEntry(elements, entryIdx, direction)}
                    }

                }
            })
        },

        onDeleteElement(state, id) {
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;
            const entryIdx = elements.findIndex(el => el.id === id.toString());

            if (entryIdx < 0) {
                console.log("NO ID FOUND @ DELETE")
                return state
            }
            clone.chapters[state.activeChapterIndex].elements = withoutEntry(elements, entryIdx);

            clone.chapters = updateLinksInChapters_mutate(clone.chapters);
            return clone
        },

        onInsertLastElement(state) {
            const clone = JSON.parse(JSON.stringify(state));
            clone.chapters[state.activeChapterIndex].lastElement = {childCoice: 2};
            return clone
        },

        onChangeLastElementChild(state, childChoice) {
            return update(state, {
                chapters: {
                    [state.activeChapterIndex]: {
                        lastElement: {
                            childChoice: {$set: childChoice}
                        }
                    }
                }
            })
        },

        onAddElement(state, typeSelected, atIdx) {
            console.log(state.activeChapterIndex)
            const clone = JSON.parse(JSON.stringify(state));
            let elements = clone.chapters[state.activeChapterIndex].elements;
            const newElem = {
                id: uuidv4(),
                type: typeSelected,
                content: initContent(typeSelected),
                timestamp: Date.now(),
                parentChapterID: clone.chapters[state.activeChapterIndex].id
            };
            
            if (elements.length===1) {
                atIdx -= 1;
            }

            clone.chapters[state.activeChapterIndex].elements = [
                ...elements.slice(0, atIdx+1),
                newElem,
                ...elements.slice(atIdx+1)
            ];
            console.log("ELEME", clone.chapters[state.activeChapterIndex].elements)
            return clone
        },

        sendSnackbarMessage(state, message) {
            if (typeof(message)==='string') {
                return update(state, {snackbarMessage: {$set: message}})
            }
            return state
        },
    }
}

export default actions