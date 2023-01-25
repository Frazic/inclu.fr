import { component$ } from "@builder.io/qwik";

export interface ResultBoxProps {
    value: string
}

export const ResultBox = component$<ResultBoxProps>((props) => {
    return (
        <div
            style={{ "display": props.value != "" ? "block" : "none" }}>
            <label for="result-box">
                <h3>Result</h3>
            </label>
            <textarea
                name="result-box"
                id="result-box"
                contentEditable="false"
                cols={30} rows={10}
                value={props.value}
            />
        </div>
    );
});