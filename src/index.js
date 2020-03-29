import addOne from './utility';

function getComponent() {
    const element = document.createElement('div');
    element.innerHTML = 'This is a barebone project with some form on asset bundeling (if I know what im doing, which I dont, really)'
    element.style.textAlign = 'center';
    element.style.fontSize = '24px';

    const utilityButton = document.createElement('div');
    utilityButton.innerHTML = '<div><button>Click me!</button></div>';

    const counter = document.createElement('div');
    counter.innerHTML = 'Click button to change me'

    utilityButton.addEventListener('click', () => {
        counter.innerText = addOne(counter.innerText);
    });

    element.insertAdjacentElement('afterbegin', counter);
    element.insertAdjacentElement('beforeend', utilityButton);

    return element;
}

document.body.appendChild(getComponent());
