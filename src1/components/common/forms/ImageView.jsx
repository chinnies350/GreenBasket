import React, { Component, Fragment } from 'react'



class ImageView extends Component {
    render() {
        console.log(this.props);
        return (

            <Fragment>
                <div className="form-group">
                    <div>
                        <label htmlFor={this.props.label}>{this.props.label}</label>
                    </div>
                    <div>
                        <img name={this.props.label} src={this.props.image} height={180} width={180} style={{border: "5px solid green", borderRadius: 10}}/>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ImageView