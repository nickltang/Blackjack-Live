import { useRef, useEffect } from "react";
import styled from "styled-components";


const StyledVideo = styled.video`
    height: 30%;
    width: 70%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

export { Video, StyledVideo }