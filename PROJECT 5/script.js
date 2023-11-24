const question = [{
    'que': "Which of the following is a markup language?",
    'a': "HTML",
    'b': "CSS",
    'c': "JAVASCRIPT",
    'd': "PHP",
    'Correct': 'a'
    },
    {
    'que': "What year was Javascript launched?",
    'a': "1994",
    'b': "1996",
    'c': "1995",
    'd': "none of the above",
    'Correct': 'c'
    },
    {
    'que': "What does CSS stands for?",
    'a': "Hypertext Markup Language",
    'b': "Cascading Style Sheet",
    'c': "Jason Object Notation",
    'd': "Helicopters Terminals Motorboats Lamborghinis",
    'Correct': 'b'
    }
]

let index = 0;
let total = question.length;
let right = 0,
    wrong = 0;
const queBox = document.getElementById("queBox");
const optionInputs = document.querySelectorAll(".options");
const loadQuestion = () => {
    if(index === total) {
        return endQuiz();
    }
    reset();
    const data = question[index]
    console.log(data)
    queBox.innerText = `${index + 1}) ${data.que}`;
    optionInputs[0].nextElementSibling.innerText = data.a;
    optionInputs[1].nextElementSibling.innerText = data.b;
    optionInputs[2].nextElementSibling.innerText = data.c;
    optionInputs[3].nextElementSibling.innerText = data.d;
}

const submitQuiz = () => {
    const data = question[index]
    const ans = getAnswer()
    if(ans == data.Correct) {
        right++;
    }else {
        wrong++;
    }
    index++;
    loadQuestion();
    return;
}

const getAnswer = () => {
    let answer;
    optionInputs.forEach(
        (input) => {
            if(input.checked) {
                answer = input.value;
            }
        }
    )
    return answer;
}

const reset = () => {
    optionInputs.forEach (
        (input) => {
            input.checked = false;
        }
    )
}

const endQuiz = () => {
    document.getElementById("box").innerHTML = 
    `
    <div style = "text-align: center">
    <h3> Thank You for playing Quiz!!! </h3>
    <h2> ${right} / ${total} was correct </h2>
    </div>
    `
}

loadQuestion();