
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
const Addnote = ({Id,selectedNote}) => {
    

useEffect(()=>{
    if(selectedNote)
    {
        setNoteDetails(selectedNote);
        return;
    }
        setNoteDetails({
            Heading: '',
            Description: '',
            Creation_Date: '',
            settings: {
                fontStyle: "normal",
                fontWeight: "400",
                noteBgColor: "#fff"
            }
        })
    
},[selectedNote])

    const [noteDetails, setNoteDetails] = useState({
        Heading: '',
        Description: '',
        Creation_Date: '',
        settings: {
            fontStyle: "normal",
            fontWeight: "400",
            noteBgColor: "#fff"
        }
    })
    

    const bold=()=>{
        const isFontWeightBold = noteDetails.settings.fontWeight !== "400";
        setNoteDetails({...noteDetails, settings: {...noteDetails.settings, fontWeight: isFontWeightBold? "400": "bold"}});
    }
    
    const Italic=()=>{
        const isFontStyleItalic = noteDetails.settings.fontStyle !== "normal";
        setNoteDetails({...noteDetails, settings: {...noteDetails.settings, fontStyle: isFontStyleItalic? "normal": "italic"}});
        
    }
    
    const onNoteBgColorChange = (targetName, targetValue) => {
        setNoteDetails({...noteDetails, settings: {...noteDetails.settings, noteBgColor: targetValue}});
    }

     const onTextInputChange = (targetName, targetValue) => {
        setNoteDetails(() => {
            return {
                ...noteDetails,
                [targetName]: targetValue
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { Heading, Description, settings } = noteDetails;
        if (Heading === "" || Description === "") {
            alert('all fields are madatory');
        } else {

            if(selectedNote)
            {
                updateNotes(e);
                return;
            }
            const saveNote = await fetch('http://localhost:5000/Notes', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Heading, Description,settings
                })
            });
            let data = await saveNote.json();
            if (data) {
                console.log(data)
               // alert('Data Upload successfully');
                Swal.fire('Data Upload successfully')
                window.location.reload();

            } else {
                alert('Error');
            }
        }

    }

//update 
const updateNotes=async(e)=>{
    const { Heading, Description, settings } = noteDetails;
            const saveNote = await fetch(`http://localhost:5000/Updatenotes/${Id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Heading, Description,settings
                })
            });
            
            if (saveNote) {
                console.log(saveNote)
                Swal.fire('Data updated successfully')
                 window.location.reload();

            } else {
                alert('Error');
            }
}

    return (
        
        <div className="container">
            <div className="row">
                <div className="col-lg-12 col-md-8 col-sm-6 col-md-4 mr-auto d-flex justify-content-center">
                    <div className="shadow card" style={{ width: '25rem',borderRadius:20,backgroundColor:noteDetails.settings.noteBgColor}}>
                        <div className="card-body">
                            <h5 className="card-title text-center">Sticky Note</h5>
                            <form method="POST" >
                                <div className="form-group mb-3">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Heading"
                                        name="Heading"
                                        style={{ border: 'none', outline: 'none', height: 20 }}
                                        value={noteDetails.Heading}
                                        onChange={(e) => onTextInputChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea type="text" className="form-control" id="floatingdescription" placeholder="Description"
                                        name="Description"
                                        style={{ border: 'none', outline: 'none', fontWeight: noteDetails.settings.fontWeight, fontStyle: noteDetails.settings.fontStyle }}
                                        value={noteDetails.Description}
                                        onChange={(e) => onTextInputChange(e.target.name, e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 my-1 mx-2">
                                    <input type="color" className="form-control" id="floatingInput" placeholder="Color"
                                        name="Color"
                                        value={noteDetails.Color}
                                        style={{ border: 'none', outline: 'none', width: 50, borderRadius: 200 }}
                                        onChange={(e) => onNoteBgColorChange(e.target.name, e.target.value)}
                                    />
                                    
                                </div>
                                <div className="input-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn" title="B" value="B" style={{ fontWeight: 'bold' , borderRadius:60,border:'none',borderColor:'none'}} onClick={bold}>B</button>
                                    <button type="button" className="btn" value="I" style={{fontStyle:'italic', borderRadius:40,}} onClick={()=>{Italic()}}>I</button>
                                </div>
                                <button type="submit" className="btn btn-primary mt-2" onClick={handleSubmit}>{ selectedNote ? "Update": "Save"}</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Addnote;