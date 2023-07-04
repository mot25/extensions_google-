import { createElementNode } from '../../utils/components';
import styles from './ButtonInPopupAnim.module.scss';

const ButtonInPopupAnim = ({ text, onClick }: { text: string, onClick: VoidFunction }) => {
    const $button = createElementNode('div', [styles.buttonActions, 'buttonActions', styles.reverse, styles.dark])
    $button.innerHTML = '<div><span>' + text.trim().split('').join('</span><span>') + '</span></div>'
    // button actions
    // button actions
    $button.onclick = onClick
    return $button
}
// <div id="pasteViewer" class="buttonActions reverse dark">Копировать/Вставить</div>

export default ButtonInPopupAnim