<script setup lang="ts">
import { useRouter } from "vue-router";
import { extensionStore } from "../store";
import DownLoadAndUpLoad from "../components/DownLoadAndUpLoad.vue"
import { Cmd, Msg, vscode, Extension, getExtensionId, Res, extensionsPostResolver } from "../utils";
import {
    provideVSCodeDesignSystem,
    vsCodeDivider,
    vsCodeBadge,
    vsCodeButton
} from "@vscode/webview-ui-toolkit";
provideVSCodeDesignSystem().register(
    vsCodeDivider(),
    vsCodeBadge(),
    vsCodeButton()
);


// const defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAFatJREFUeF7tXXt0k1W2P3knbdo0aUvfbdJKW9qpMhcdRYvKG4ugI+AItFS9LBz13qtcQb3oLHHWKArq1btGZ8E4SksBBUSelWflSgdkIesKtfSBbZK+KWnSpGnzTu7aKcW0Ju358j2apDn/Zp999uOX852zzz77sNAEbL8vayiUy3irMqSCIlBfrbNUqrS28q9Lc6onmjlYE0XhpRUNs9Ml4HThfD6HleBNb6vDdV2tMx9v0dvK9xXnnJ4ItglpACzbcXVhukxYkh4tmMvnsmVEHGq1O7VtBstJda+tfM/KnEoifYOJNuQA8IedjY/JJbziFIlgFo/LklDhDJvdpW/XW6pUelvFlyuz91PBM1B4BD0AXC4Xq3jnteXyWP7KxCj+A1wOK5JO41rtzv5Og+2MWmvduat48hcsFstF53h08w5KAKzZ+gPPIhEXp0lFKxLFvEIOmyWk21De+DucLnOX0VbdqjPtEuiNFdueudM2HnKQGTNoADBvy+XI5HRRSUaMYHm8mD+dw0Y8MopT3dfhRLYbRut5da9ld0eLaceJ9Xf0Uz0GHfwCGgDzP62VJYk5qxSxkY/LIrh3c9mITYcRqOZpdyKn1mS/oNT07+k0OsqPr87XUj0GVfwCDgAPflybmBXHKZXHRSyTCrnTOOyAE5GQ7R1OF9KZ7ZdUmoG9TRpH2Znn87sIMaCZOCCsO+vTqxmKaF5pVqxgqUTELWCzmBHL6RpcvzE5nt5kr2nqsexTGmxlVavz1DT7d0z2zFjaixizt9VlZ8VySzNloseiBOxcppxgd7iQUmdGKq0ZKXUWt2QKqQDJZUKkkAoRl8OMSQB8fRZnfbPWtL+px152es2UxjG9RQMBM9reFLxoa11Behw4XfioWMDJYjH0T7fYnUilMyOl1uJ2vK99GxjDDQSZAMmlQiTgMrPkcLlcyGhxNDVrzQeadbbtJ1bn/USDr72yZAwAb1e11klF3FymFDPZHIMO15kh1u/XsBkwM0gHASHicfzi4U8nnclev2FW2hR/+hLtwwgA1h1WlmXFCVcRFY4ovdHiuPVPb9P753RfY6ZKBLdmBrGAfjA0aczl7y1SlBK1AVF62gGwYndDSWFGVDld073BbL/1T+8wWInq7xd9cjT/1swQLeT6xWOsTvBZqFb3rdq1PGfHWLRkfqcVAA/9/XJqUV58LZfNiiYj5Mi+OpP95iLOjK73jW/wLSGK5148wtpBKqIWDHany/D1le68qmentlNpP09etALgnarWCxIR93dUCN/Tb7u5eregG/3j63Rf+sRH8pBcJnADIjaSmkBlt9H2/Rtz06dTYUNvPGgDwLP7mzffniRaT0bwbqMVqbQWt+O1A3YyrBjvK4vg3poZJonJgeFKp2nL3x7LfJkOJWgBwOLPa+bOy4494U8Ur6vPipRa2KdbUK85uJzuy0ExIi6SS2ERKUSJUXzCfoRo4onGnnmHnio4SbjzGB0oB8CyPbX8exMlSiGPk4wrbLsetmsWt+P7LA7cbkFJFyXguIEAgEiRCLB1MNscHee69Iq9j+dTutKlHACvHVNVpkoED+Fopjfb0cFaLeq3hrbTfdkiks9Bj+TLkARzJ9GmN3/z1gKFO4+RqkYpAJ7e2/DSXanR7+EKd+SqFrVSvF/HHTtQ6NIkAvRwHn622vdthnVly3Lep0p+ygBQtK126vw86UU+h4W1F7rY2od+aDNSpUdQ87kzVYzuSovC0sHqcNmPX9XdVbkm/0esDkysASAt68Pqjjohl52DI1SLzoKO1gfsETmOCpTTLMyVoXQp3prAbHc2rJ2RQklYnZIZYO3h5u3ZcSKssCUczOy9ogn5xR5RhMDicNntcdgHUPU3Bj7/aHHW00THGUlPGgDLK+qLZ2RG78AN9Z681ot+1pjIyh2S/W+LE6G5k2OwdINQ8dlmQ8nu4twKrA4+iEgBYP7Wq0kL82PqeRy8UG9NZz+qVhnIyBvyfQvl0aggCS+x2eZwGY7W9uYefyav01/DkALAmyfV5yaJ+VhhSojqfVXT46+cE6rfkoJYNEmMFzDqNlrPvzE3415/DeQ3AJ77qundguQI7PDkviuagI3h+2s8uvrBmcLS2+Ow2dd09G/+ZMltr2B38CD0CwCPbq+dPWey9BRuqPesUo9+6hrwR74J2+c3iRFohgLvYhOEik9d08058GQ+4fuMhAGw8dtvuRJutkrIZafgeOeaxoROXevFIQ3TjLDAnMkxaHKcCMsuZruzXW9vlG+cOZPQAQphAPzpmOpIskSwEEcqSNaALZ/VEdS3p3BUpYWGz2G5t4a4SSctWsuRTQvli4gIQwgApV9eW3tPuvgD3AGO1GlRay+1qVm4Y4cKXVqMAD08BT9UfE5tXLvjickf4uqPDYCiz+sKFkyWXOJxWFiH2+FQL64LxqYjEiq2OVy2Y9f00yqfmlIzNmeEsAHw/tm2ugguByv82NJrQUfrwqFeHAfg0iycIkPpMXih4gG7o/6lGalYWcVYAPiPg03/mDIpAivsaIVQb40GGcwT84gX16FE6aKFHLSsIA7xMe8q1HUPfPY/j2T961jjjAmAJyrqVtyfKdmJG+qFFT+s/P1pkG0767YYlBLNdx+MRGOmXxssDgQHTO0GK6r6uRcxlR3sj45k+sCOAHYGOA1Cxd8161d+UTxl12j0owJg8a7mhLkZwgYuG6/SRk1XP6pWEg/1ZsYK0fPTk9D9mRIEK18yDXYc3zXr0cfnO1Fzj5kMq4DsW6iIRgWJeKFiu9OlP6k25xxakXndlzKjWvvNE+p/ToriY4UZu4029FWNhrDRpqWI0cZ56djfN9wBYB2y8UQLutQeejkHSwriEG6iaXef9dwb8zLuIwyA5w40bSpIiHgV1+DgfAABkXZ7UiR6e0EGgq0OHQ22oBuOqdGVzqCo1YBtAnA+gAC3/dhh3LR1yeQN3ui9zgCLPqudNT9Heho31AvTPkz/RNt7Dyvc3zRyk77vUSH8BGuSdUeUREULeHr4DMDnAKfZHC50slE3+/DT+VUj6X9l+40uF1tS3d4i5HJoDfXeJ49Gby3IGHabxulC6McOI/r4XCfhdDHYKz9/bxKamixGnjUl4BbRa8fU6J8heAxNLFTsaNcXpqRvZLGcniD4FQD+q1J5MF0qXIyDLAj17qvpQZDlQ7Q9Nz0Jrb47AXE8roiDk+DfOmAjzg/Gj+CxEcwqAK6h5nC50KcXrqNPzvt9ZE5UNcbo4fr60oJY7FCxWmc+9E6R4hGfAFj1ReML0zOisMOIEOyBxZY/bctCBZqX/cuWxmRzone+bUMHasnlDDyaH4tenZmKRLxf7vafaOxF64+G3mcA7A7BIQgS4bbz6r4Xy5/I/miIftgM8MF37TdEPDbW6uKHtj50sdX/FfZ/L1K49/xDDQJHG46p0Fk/tpGeys9QRKO3F8gRBE6GGsQG1h4OTQCAjnelidGdqXhZxSabU/Of96fEewXAR9XtGj6HHTsWmmB1DQc9ZBqTAIDdCVw5o6IFatAJDoxwdlMWm7PnxftTbv3Jh80AOACwOpwIsnv0JEO9TAKACsd74xFIQSeJkOPOIuJzRi9rQxoAVJ3y0QWA36aI0eYiOXaghApwBErQCefUMOQBAA6F7SUsjOiKL3gDTSAEncIAuOkZuJv/7D1J7jt3sDVkogVC0CkMACY8jRAK1KBTGAAMAQCGCcSgUxgADAIAhgq0oFMYAAwDINCCTmEAhAEwZp2BCbENZAoH4RmAhKXpCgSREIlw1zAACJvslw5hAJAwno+u4TUA9TYdlWN4BiBhcKpmAEgl/8Md8eg+eRSCit6eeQAkxKOt6+DbBYOnqXCo5m/yizcBJ9QMQGUqOW3eHoUxhI4vd/SjN0+1UJa+PmEAUPIvk9zpZDGYBRbHw8G4Y0KpvH8/0ETJTDAhAPDijGS0Ymo8djUtXEeMF53Z7kRbzrSjfX7cqRgpc8gDoGTaJPRv9yYhoZf7cVAlA66EQRZwILe4SB5KiuYPO6qmKmcxpAEA5dNen52GoPK2Z4Oc97MqA9r6fSeq7/bvTiKTgPGWsAJ3Kop3k380LGQB4OsGEaSlffBdO+lMYiYBsLQgDq1/MGXYLHamSY9eONRMWoyQBABs894tkiMAgWeDb+dfz3WiHZe6SRuOKQbegAy7gfJL3W4gk20hBwA4c//Lggx3+rhnehd877+4rEGbz7SRtRlj/X0BuWcAbi6p0Hl1H2lZQg4A3hZ98I+BPP/Xj6kp2TqRtjoGA6aAHFIA8LXog5u+r1SqgqoIxMsPpqIn7ohDnpdt6QByyADA16LvutGGNnyjInxxFONPShsJlH1d90Dqr5JT6QBySACgqccc0os+QFqvyY7+croVQeV0KlvQA+D142r3GzqhvOijc/cS9AA4rza4C0bQ/a2k8l/njRdTi76QCgXDosjlQsOKO4CCdHwr6QYAU4u+kAKAN6cEwnUromDxdV7BBJCD+hMw0tB0LZSIOpQIva+tK1NADhkAQNYMhHkhRBosLS8hwr17GVnOlUkghwQA6AiQ0A0iX4s+Olf83nQKKgDA0S7Uwh/ZGjUm9MLB5qCJ9MFNZNBlZlbMsAUsABlqKEGFMqZaUAFg5W/j0QuFyb/K7IFDkT/u/5kpm5EaB2IWT05LQIpY4a9qETCx6BuXXQBVJWIgqfP9hxUoUyYcpgckeCh1ZmT2s1QcKY9idmazWChFwncnp3grQsHUos9TXMZKxMCgVBSJAj6jpXhh+iLgyCAt7a3TrYy/j8hYkaghi5MtEzfEx1vQJOC8iiEQfPOvdg2gP59uYTw1jUiZuFEvhzJZKNLTpn+8JxGV3pnAWDkXDH8SIrlhtKEvL2vQzv/rZjxHgdJCkaD1q5XKgxkMlIodaeHcSSJUOi0B3Z0e5a4f7Fnvl5A3GCCGmsYGi939T4eVPhSkpvKGD64KREvFtujMhzaNVioWBmaqWDSukmE63xagpVg0DMdUufiwc/23AG3l4odEYuLBCP/Vn9g9aX8wYsi8TDwZM7Fd6Z/2jDwZA6Ix9WiUf2aYmL0YfTQKTMzks3ET06X4WjP+bNyQaOGHI/GdRBfluD0cOaRQ+OlYulyLx3dcn44FEcOPR+M5ig4qnGPeoXFpezwaBgg/H0+He0fnGTDPxw+J+adjqiPJEsFCHFPAq2J7r2gQvKwRbsQtAM/oQtJMNGYpnBad5cimIvkiIiMRflNh47ffciXcbJWQy6b1XUEiSoQqLbFQr7Ndb2+Ub5w5k1CJFMIAAGM/ur129pzJ0lO4L4ueVerRT10DoeonWvT6TWIEmqGQYPGG6/KnrunmHHgy/zRWBw8ivwAA/Z/76ud3C5IjX8YdEGri3egn9rYwLu9Qo4uP5LkfgMJtNR0Dmz9ZkvUKLr0nnd8AACZvnlSfmyTmT8cZuNtoRV/VkHsUEmecUKCBG8WTxHwsVbqN1vNvzM3AeuHdG0NSAJi/9WrSwvyYeh6HhfWKcU1nP+OpUlhWDCCiQnk0KhhRDseXeDaHy3C0tjf3+DN5fr+LSwoAINjyivriGZnRO1gebwCPZk+4Ev2zJvCreY0HJm6LEyG4XYTTXC4XOttsKNldnFuBQ++LhjQAgPHaw83bs+NEpTiCwK0f2Br2WRw45BOGJkrAcW/5IMsHp9XfGPj8o8VZT+PQjkZDCQBcLhfrw+qOOiGXnYMjUIvOgo7Wk3t6FmecYKJZmCtD6VIBlshmu7Nh7YyUXCziMYgoAQCMUbStdur8POlFPoc1vJKjDwGoeoGUCiOMNw8ioV6rw2U/flV3V+Wa/B+pkJsyAIAwpXsbXronNfo9XMGOXNWiVr1/z8/jjhHodGkSgfuBS9x2sc2w7rNlOe/j0o9FRykAYLDXjikrUyXCh8YaGH7Xm+3oYK0W9Vsn5nogks9xl8SRYIZ62/SWb95aIC/CsS0uDeUAWLanln9vokQp5HGScYVo11vcjygoteaQXxzCYk8hEyK5VIBSJHjffLCj2eboONelV+x9PN+Ka1ccOsoBAIMu/rxm7rzs2BO4oWJPQbv6rG4gACDgbn0oNHjXQC4TuB2fGIUX4PHUG0K9Jxp75h16quAk1fagBQAg5LP7mzffniRaT0bgbqMNqbRm92VR7UBwgQGujSukQrfjcaN6vmx1pdO05W+PZWKH3YnYnDYAgBDvVLVekIi4vyMikC/ann6bGwgqrSVgzxQghu/+p0uFKDaSR4XaqNto+/6NuelY4XZ/BqQVAA/9/XJqUV58LZeNFyrGVQAehRiaGa73je8BU0IU7+Y/Xei+0kZlsztdhq+vdOdVPTuVfClxH4LRCgAYc8XuhpLCjKhy3FAxUQNC0olSC4tIM2NVRaDyt1wqRAqZADtZg6heEOqtVvet2rU8ZwfRvkToaQcACLPusLIsK064iohg/tAaLQ43EAAQbRTHF+BJOnA4OF4s4PgjHqE+TRpz+XuLFFjhdUKMRxAzAgAY8+2q1jqpiEtJ+BJHYZPNcWtmUOv8CzZlSAcdDo4X8eh3+pBeOpO9fsOstCk4epKlYQwAIGjR1rqCjHjuk1lxokciuOwsuj4LI40y+Fjj4MwAawdfGYpgDLls0OHgeNyDGbJOgOneaHE0NWvNB1o09rLKZ6bUkOWJ259RAHgKVbStLjs1lluaKRM9FiVg50LdHSaa/WYNosFF5ODMoIB/OjheKkRcDjNyOF0u1Gdx1jdrTfubeuxlp9dMIf9qlB8GZEbbMQSb9enVDEU0rzQrVrBUIuIWMAUGcAI0JsfTm+w1TT2WfUqDraxqdR5zNeTGaxdAFJQPflybmBXHKZXHRSyTCrnT/IkmEh2TTnqI4unM9ksqzcDeJo2j7Mzz+V10jkeUd0DMAL6Env9prSxJzFmliI18XBbBvZvLRnjZEkStQDG93Ymc2gH7BWVP/55Oo6P8+Or8gE1+CGgAePpl3pbLkcnpopKMGMHyeDF/OoeNqAm1UeR8hxPZbhit59W9lt0dLaYdJ9bf0U8Ra1rZBA0APK2wZusPPItEXJwmFa1IFPMKOWzW8GqTtJrsF+YOp8vcZbRVt+pMuwR6Y8W2Z+4c37CkH3oHJQA89YR0tNKd15anxfJXJkbxH+ByWMNfmPTDKKN1sTtc/V191v9V9Vh3VqycvJvFYgX1vbegB8BIZxXvalySEsMrTpMIZnLYLLyrNWOAxGZ36dv1liqV3lbx5crs/RRjalzZhRwAPK25sqLu4RSpoCRVIpjD47Dx864QQla7U9tisJxs0Zp37C3JOzquXqJx8JAGgKfdllY0zE6X8FZlSIXz+RxWgjebWh2u62qd+XiL3la+rziH8D07Gv1EG+sJAwBPC/6+rKFQLgMwCNz5dWqdpVKltZV/XZpTTZulA5Tx/wORRBw1+O9h2gAAAABJRU5ErkJggg=="
const extensions = extensionStore()
const router = useRouter();
function deleteExtension(data: Extension) {
    vscode.postMessage(new Msg(Cmd.deleteExtension, data), (res: string) => {
        if (<Res>JSON.parse(res).success) {
            extensions.getExtensions();
        }
    })
}
extensions.getExtensions();

function update(item?: Extension) {
    extensions.updatePage.extensionList = [...extensions.extensionArray];
    extensions.updatePage.extensionPack = [];
    extensions.updatePage.currentExtension = new Extension();
    if (item) {
        extensions.updatePage.isUpdate = true;
        extensions.updatePage.currentExtension = Extension.copy(item);
        extensions.updatePage.extensionList = extensions.extensionArray.filter(e => !item.pck.extensionPack.includes(getExtensionId(e)));
        extensions.updatePage.extensionPack = extensions.extensionArray.filter(e => item.pck.extensionPack.includes(getExtensionId(e)));
    }
    router.push({
        name: "update"
    })
    extensionsPostResolver(extensions.updatePage.extensionList)
    extensionsPostResolver(extensions.updatePage.extensionPack)
}
function resolveClick(item: Extension) {
    item.isClicked = !item.isClicked;
}

</script>

<template>
    <div class="outer">
        <div class="top">
            <DownLoadAndUpLoad :extension-pack-arr="extensions.customExtensionPack"
                :call-back="() => { extensions.getExtensions() }">
            </DownLoadAndUpLoad>
            <h1 class="title">Extension Pack Management</h1>
            <div class="buttonWraper" @click="update()">
                <vscode-button class="create">
                    <div class="icon">
                        <svg t="1684482151439" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="3318" width="18" height="18">
                            <path
                                d="M588.8 435.2h358.4a76.8 76.8 0 1 1 0 153.6h-358.4v358.4a76.8 76.8 0 1 1-153.6 0v-358.4h-358.4a76.8 76.8 0 1 1 0-153.6h358.4v-358.4a76.8 76.8 0 1 1 153.6 0v358.4z"
                                p-id="3319"></path>
                        </svg>
                    </div>
                    <div class="info">Create</div>
                </vscode-button>
            </div>
        </div>
        <vscode-divider></vscode-divider>
        <div class="bottom">
            <div class="intoduction" v-if="!extensions.customExtensionPack.length">
                click the button and create your first extension pack🎇
            </div>
            <div class="item" v-for="item in extensions.customExtensionPack" :key="`extension:${item?.dirName}`">
                <div :class="{ extensionPack: true, activeExtensionPack: item.isClicked }" @click="resolveClick(item)">
                    <img :src="item.img" class="logo" draggable="false">
                    <vscode-badge class="packNum"
                        :style="{ visibility: item?.pck?.extensionPack?.length ? 'visible' : 'hidden' }">
                        {{ item?.pck?.extensionPack?.length }}
                    </vscode-badge>
                    <div class="info">
                        <h3 class="displayName">{{ item?.pck?.displayName }}</h3>
                        <p class="discription">{{ item?.pck?.description }}</p>
                        <h4 class="publisher">{{ item?.pck?.publisher }}</h4>
                    </div>
                    <div class="edit" @click.stop="update(item)">
                        <svg t="1684230815052" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4208" width="20" height="20">
                            <path
                                d="M800 959.96l-576 0c-52.9 0-96-43.1-96-96l0-640c0-52.9 43.1-96 96-96l448 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-448 0c-17.6 0-32 14.4-32 32l0 640c0 17.7 14.4 32 32 32l576 0c17.7 0 32-14.3 32-32l0-512c0-17.7 14.3-32 32-32s32 14.3 32 32l0 512C896 916.96 852.9 959.96 800 959.96zM511.7 542.76c-8.3 0-16.5-3.2-22.8-9.5-12.4-12.6-12.3-32.8 0.3-45.2l418.3-413.7c12.6-12.4 32.8-12.3 45.2 0.3 12.4 12.6 12.3 32.8-0.3 45.2l-418.3 413.7C527.9 539.66 519.8 542.76 511.7 542.76z"
                                p-id="4209"></path>
                        </svg>
                    </div>
                    <div class="delete" @click.stop="deleteExtension(item)">
                        <svg t="1684230900952" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="6035" width="30" height="30">
                            <path
                                d="M656 288h144a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16h-48v496a16 16 0 0 1-16 16H288a16 16 0 0 1-16-16V336h-48a16 16 0 0 1-16-16v-16a16 16 0 0 1 16-16h144v-80a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v80z m-48 0v-48H416v48h192z m32 48H320v464h384V336h-64z m-208 112h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z m144 0h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z"
                                p-id="6036"></path>
                        </svg>
                    </div>
                </div>
                <div class="secondaryExtensionPack" v-show="item.isClicked"
                    v-for="packItem in extensions.getExtensionInPack(item?.pck?.extensionPack)"
                    :key="`pack:${packItem?.dirName}`">
                    <img :src="packItem.img" class="logo" draggable="false">
                    <vscode-badge class="packNum"
                        :style="{ visibility: packItem?.pck?.extensionPack?.length ? 'visible' : 'hidden' }">
                        {{ packItem?.pck?.extensionPack?.length }}
                    </vscode-badge>
                    <div class="info">
                        <h3 class="displayName">{{ packItem?.pck?.displayName }}</h3>
                        <p class="discription">{{ packItem?.pck?.description }}</p>
                        <h4 class="publisher">{{ packItem?.pck?.publisher }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">


@minHeight: 350px;
@outerHeight: 100vh;
@outerWidth: 1000px;

@topPadding: 50px;
@topHeight: 50px;
@topWidth: @outerWidth;

@bottomWidth: @outerWidth;
@bottomHeight: 75vh;

@extensionPackWidth: @bottomWidth * 0.98;
@extensionPackHeight: 100px;
@extensionPackMargin: 0.1 * @extensionPackHeight;

@packNumPaddingTop: @extensionPackHeight*0.7;

@buttonHeight: 40px;
@buttonWidth: 120px;

@topMarginTop: @topHeight*0.5;

.alignHorizontal(@height, @width) {
    width: @width;
    height: @height;
    margin: 0 auto;
}

.alignVertical() {
    top: 0;
    bottom: 0;
    margin: auto 0;
}

.align() {
    top: 50%;
    transform: translateY(-50%);
}



.outer {
    .alignHorizontal(@outerHeight, @outerWidth);

    .intoduction {
        font-style: italic;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 30px;
        position: absolute;
        top: 200px;
        width: 727px;
        left: 50%;
        transform: translateX(-50%);
    }

    .top {

        display: flex;
        justify-content: space-between;
        line-height: 0;
        .alignHorizontal(@topHeight, @topWidth);
        padding-top: @topPadding;

        .create {
            .alignVertical();
            height: @buttonHeight;
            width: @buttonWidth;
            display: flex;
            justify-content: space-around;
            position: relative;

            .icon {
                position: absolute;
                left: @buttonWidth * 0.05;
                .align();
            }

            .info {
                position: absolute;
                right: @buttonWidth * 0.2;
                font-size: 18px;
                font-weight: bold;
                .align();
            }
        }

    }

    .bottom {

        min-height: @minHeight;
        cursor: pointer;
        overflow-y: auto;
        overflow-x: hidden;
        .alignHorizontal(@bottomHeight, @bottomWidth);


        .item {
            box-sizing: border-box;


            .extensionPack {
                box-sizing: border-box;

                min-height: 65px;
                display: flex;
                position: relative;
                width: @extensionPackWidth;
                height: @extensionPackHeight;
                border: 1px solid transparent;
                padding: @extensionPackHeight * 0.1 0;
                padding-left: @extensionPackWidth * 0.01;

                .logo {
                    height: @extensionPackHeight * 0.8;
                    width: $height;
                }

                &:hover {
                    //vscode本身定义的变量
                    background-color: var(--vscode-commandCenter-background);
                }

                .packNum {
                    position: absolute;
                    bottom: 0;
                    left: @extensionPackWidth * 0.01;
                }

                .info {
                    padding-left: @extensionPackWidth * 0.02;
                    line-height: 0;
                    .alignVertical();
                    overflow: hidden;
                    width: @extensionPackWidth*0.65;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .buttonSize() {
                    height: 24px;
                    width: 24px;
                }

                .delete {
                    position: absolute;
                    right: @extensionPackWidth * 0.1;

                    &:hover {
                        //vscode本身定义的变量
                        background-color: var(--vscode-scrollbarSlider-hoverBackground);
                    }

                    .buttonSize();
                    .align();

                    .icon {
                        fill: currentColor;
                        position: absolute;
                        transform: translateX(-10%);
                        top: -10%;
                    }
                }

                .edit {
                    position: absolute;
                    right: @extensionPackWidth * 0.15;

                    &:hover {
                        //vscode本身定义的变量
                        background-color: var(--vscode-scrollbarSlider-hoverBackground);
                    }

                    .buttonSize();
                    .align();

                    .icon {
                        fill: currentColor;
                        transform: translateX(10%);
                        position: absolute;
                        top: 10%;
                    }
                }
            }

            .activeExtensionPack {
                background-color: var(--vscode-commandCenter-background);
                border: solid 1px var(--vscode-focusBorder);
            }

            .secondaryExtensionPack {
                .extensionPack();
                height: @extensionPackHeight * 0.65;
                padding: @extensionPackHeight * 0.05 0;
                padding-left: @extensionPackWidth * 0.01 + 0.11 * @extensionPackHeight ;
                opacity: .5;

                .logo {
                    height: @extensionPackHeight * 0.55;
                    width: $height;
                }

                .info {
                    padding-left: @extensionPackWidth * 0.02 + @extensionPackHeight * 0.105;
                    font-size: 12px;
                }

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
