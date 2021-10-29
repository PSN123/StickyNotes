import React, { useState, useEffect, useMemo } from 'react';
import Addnote from './Addnote';
import Swal from 'sweetalert2'    

const Sticky = () => {
    const [show, setShow] = useState(false);
    const [stickyNote, setstickyNote] = useState([]);
    const [notesObject, setNotesObject] = useState('');
    const [totalCount,setTotalCount]=useState([]);  
    const [noteId, setNoteId] = useState();
    const [sortingData, setSortingData] = useState();
    const [currentPage,setCurrentPage] =useState(0);
    const [postPerPage,setPostPerPage]=useState(8);
    const [deleteNotes,setDeleteNotes]=useState(false);
    let [style] = useState();
    let [displayStyle, setDisplaystyle] = useState(true);

    const image={
        backgroundImage:`url(https://cdn.pixabay.com/photo/2018/09/03/11/51/doodle-3651040_1280.png)`,
        backgroundSize:'cover',
    }

    const fetchNotes = async () => {
        const notesData = await fetch(`http://localhost:5000/sorteddata/${sortingData}/${postPerPage}/${currentPage}`);
        const data =await notesData.json();
        setstickyNote(data.NotesData);
        setTotalCount(data.Total_Record);
    }

    useEffect(()=>{
        fetchNotes();
    },[sortingData,currentPage,deleteNotes])

    useEffect(() => {
        console.log(noteId);
        console.log(sortingData)
        console.log(deleteNotes);
    }, [noteId,sortingData])
    
    useEffect(()=>{
        if(deleteNotes===true){
            fetchNotes();
            alert('fired')
        }      
    },[deleteNotes])


    const styleHandler = (e) => {
        style = e.target.value
        console.log(style);
        if (style === "Cards") {
            setDisplaystyle(true)
        } else {
            setDisplaystyle(false)
        }
    }

    const sortingHandler = async (e) => {
        const { name, value } = e.target;
        setSortingData(e.target.value)
        try {
            const data = await fetch(`http://localhost:5000/sorteddata/${sortingData}`, {
                method: 'GET',
                header: {
                    "Content-Tyep": "application/json"
                }
            })
            // const response = await data.json();
            // console.log(response)
        } catch (err) {
            console.log(err);
        }

    }



    const deleteItem = async (index) => {
        console.log(index);
        const ok = window.confirm('are you sure??');
        if (ok === true) {
            alert('Item Deleted Successfully');
            setDeleteNotes(true)
            await fetch(`http://localhost:5000/Delete/${index}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            
        } else {
            alert('No Item Delete');
        }

    }


    const Update = (stickyNote, index) => {
        setNoteId(index);
        setShow(true)
        setNotesObject(stickyNote)
    }

    const onAddNoteClick = () => {
        setNotesObject("");
        setShow(true)
    }

// pagination code 

const pageNumbers=[];
for(let i=1; i<=Math.ceil(totalCount/postPerPage);i++)
pageNumbers.push(i);


    return (
        <>
        
            <button type="button" className="btn btn-primary mt-2" onClick={() => onAddNoteClick()}>Add Note</button>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-12">
                        {
                            show ? (
                                <>
                                    <Addnote Id={noteId} selectedNote={notesObject} />
                                </>
                            )
                                : ""
                        }


                        <div className="mx-3 mt-4">
                            <select className="form-select"
                                name="Style"

                                onChange={styleHandler}
                            >
                                <option selected>Select style</option>
                                <option value="Cards">Cards</option>
                                <option value="List">List</option>
                            </select>
                        </div>

                        <div className="mx-3 mt-4">
                            <select className="form-select"
                                name="Style"

                                onChange={sortingHandler}
                            >
                                <option selected>Sorting type</option>
                                <option value="Ascending">Ascending</option>
                                <option value="Descending">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row mt-5" >
                    <div className="col-md-12" style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", justifyContent: 'center' }}>
                        {
                            pageNumbers.map((countvalue,index) => {
                                return (
                                    <nav>
                                        <ul className="pagination">
                                            <li className="page-item"><a className="page-link" key={countvalue} onClick={()=>setCurrentPage(index)}>{countvalue}</a></li>
                                        </ul>
                                    </nav>
                                )

                            })
                        }
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row mt-5 mb-4" >
                    <div className="col-md-12" style={displayStyle === true ? { display: 'flex', flexDirection: 'row', flexWrap: "wrap",justifyContent: 'center'} : { display: 'flex', flexDirection: 'column' }}>
                        {
                            stickyNote && 
                            stickyNote.length && 
                            stickyNote.map((currentvalue, index) => {

                                return (

                                    <div className="shadow card mt-5 mx-2" style={{ width: '15rem', borderRadius: 20, backgroundColor: currentvalue.settings.noteBgColor }} key={currentvalue.id}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ fontSize: 15, color: 'white' }}>{currentvalue.Heading}</h5>
                                            <p className="card-text" style={{ fontWeight: currentvalue.settings.fontWeight, fontStyle: currentvalue.settings.fontStyle }}>{currentvalue.Description}</p>
                                            <h6 className="card-subtitle" style={{ float: 'right', fontSize: 10 }}>{currentvalue.Creation_Date}</h6>
                                            <div className="btn-group" style={{ marginTop: 60, display: 'flex', justifyContent: 'space-around' }}>
                                                {/* {console.log(currentvalue.length)} */}
                                                <i className="fas fa-trash addbutton btn-lg text-danger"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => deleteItem(currentvalue._id)}></i>

                                                <i className="fas fa-edit addbutton btn-lg text-success"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => Update(currentvalue, currentvalue._id)}></i>
                                            </div>

                                        </div>
                                    </div>

                                )

                            })
                        
                        }
                        

                    </div>
                </div>
            </div>
           
        </>
    )
}

export default Sticky;