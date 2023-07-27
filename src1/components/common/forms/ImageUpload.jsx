
import React, {  useState } from "react";
// import './imageUpload.css'
import classnames from 'classnames';
import { asField } from 'informed';

// import imageLogo from './FileUpload.png'
function ImageUpload({ fieldState, fieldApi,faClass, ...props }) {
    const [imageUrl, setImageUrl] = useState(props.ImageLink);
    // const [imageView, setImageView] = useState(true);
    // console.log("imageUrl", imageUrl,fieldState)
    // console.log(props.ImageLink)
    // if(props.ImageLink){
    //     setImageUrl(props.ImageLink);
    // }

    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const { field, onChange, onBlur, initialValue, forwardedRef, className, content, ...rest } = props;
    function FileonChange (event){
        if(event.target.files[0]){
            setImageUrl(URL.createObjectURL(event.target.files[0]));
            // setImageView(false);
            setValue(event.target.value)
            // console.log(event)
            props.onChange(event)
        }
        
    }
    // let IMGURL = ""
    // if(imageUrl){
    //     IMGURL = imageUrl 
    // }else if(props.ImageLink){
    //     IMGURL = props.ImageLink
    // }else{
    //     IMGURL = imageLogo
    // }
    return (
        <>{faClass && <i className={faClass}></i>}
        {props.label && <label htmlFor={field}>{props.label}{props.required && <i style={{color:"red"}}>*</i>}</label>}

                    <div className="panel-body">
                    
                        <form>
                            <div className="col-sm-12 p-0 form-group">
                            
                                <label>
                                    <input 
                                    {...rest}
                                    id={field}
                                    ref={forwardedRef}
                                    type = "file"
                                    required = {false}
                                    value={!value && value !== 0 ? '' : value}
                                    className={classnames(`form-control ${className}`, { "is-invalid": fieldState.error })}
                                    onChange={e => {
                                        FileonChange(e)
                                    }}
                                    onBlur={e => {
                                        setTouched(true);
                                        if (onBlur) {
                                            onBlur(e);
                                        }
                                    }}
                                    style={{ display: "none" }} accept="image/*"
                                    />

                                    { imageUrl && 
                                     <div className="imgSelected" style={{ width: '150px',height:'150px', backgroundImage:`url(${imageUrl})`, backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
                                    }
                                    { ! imageUrl && props.ImageLink && 
                                     <div className="imgSelected" style={{ width: '150px',height:'150px', backgroundImage:`url(${props.ImageLink})`, backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
                                    }
                                    {
                                       ! imageUrl && !props.ImageLink  && <div className="imgSelected" style={{ width: '150px',height:'150px',  backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
                                   
                                    }
                                    <div className="imageOverlay">Click To Upload</div>
                                    {fieldState.error ? (<div className="invalid-field">{fieldState.error}</div>) : null}
                                </label>
                            </div>
                        </form>
                    </div>
                {/* </div>
            </div> */}
        </>
    );
};

export default asField(React.memo(ImageUpload));



