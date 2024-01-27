import { createWriteStream } from "fs";
import { ZipFile } from "yazl";
import { Extension } from "../share";
import { unlink } from "fs/promises";

interface IFile {
    path: string;
    readonly contents: Buffer;
}

async function writeVsix(files: IFile[], packagePath: string) {
    await unlink(packagePath);
    return new Promise((resolve, reject) => {
        const zip = new ZipFile();
        files.forEach(f => zip.addBuffer(f.contents, f.path));
        zip.end();
        const zipStream = createWriteStream(packagePath);
        zip.outputStream.pipe(zipStream);
        zip.outputStream.once('error', reject);
        zipStream.once('error', reject);
        zipStream.once('finish', () => {
            resolve(true);
        });
    });
}

function getSeriesValues(array?: string[]): string {
    if (array) {
        let result: string = array[0];
        for (let i = array.length - 1; i > 0; i--) {
            result += `,${array[i]}`;
        }
        return result;
    }
    return "";
}

export async function packageExtension(extension: Extension, path: string) {
    const { packageJson, image } = extension;
    const array = [
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '\t<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">\n' +
        '\t\t<Metadata>\n' +
        `\t\t\t<Identity Language="en-US" Id="${packageJson.name}" Version="${packageJson.version}" Publisher="${packageJson.publisher}" />\n` +
        `\t\t\t<DisplayName>${packageJson.name}</DisplayName>\n` +
        `\t\t\t<Description xml:space="preserve">${packageJson.description}</Description>\n` +
        `\t\t\t<Tags>${getSeriesValues(packageJson.keywords)},__web_extension</Tags>\n` +
        `\t\t\t<Categories>${getSeriesValues(packageJson.categories)}</Categories>\n` +
        '\t\t\t<GalleryFlags>Public</GalleryFlags>\n' +
        '\t\t\t\n' +
        '\t\t\t<Properties>\n' +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Code.Engine" Value="${packageJson.engines?.vscode}" />\n` +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />\n' +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="${getSeriesValues(packageJson.extensionPack)}" />\n` +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="ui,workspace,web" />\n' +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />\n' +
        '\t\t\t\t\n' +
        '\t\t\t\t\n' +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="${packageJson.repository?.url} />\n` +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Links.Getstarted" Value="${packageJson.repository?.url}" />\n` +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Links.GitHub" Value="${packageJson.repository?.url} />\n` +
        `\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="${packageJson.repository?.url.replace(".git", '')}/issues" />\n` +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Links.Learn" Value="https://github.com/bloodycrownD/simple-extension-manager#readme" />\n' +
        '\t\t\t\t\n' +
        '\t\t\t\t\n' +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />\n' +
        '\t\t\t\t<Property Id="Microsoft.VisualStudio.Services.Content.Pricing" Value="Free"/>\n' +
        '\n' +
        '\t\t\t\t\n' +
        '\t\t\t\t\n' +
        '\t\t\t</Properties>\n' +
        '\t\t\t\n' +
        '\t\t\t<Icon>extension/logo.png</Icon>\n' +
        '\t\t</Metadata>\n' +
        '\t\t<Installation>\n' +
        '\t\t\t<InstallationTarget Id="Microsoft.VisualStudio.Code"/>\n' +
        '\t\t</Installation>\n' +
        '\t\t<Dependencies/>\n' +
        '\t\t<Assets>\n' +
        '\t\t\t<Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />\n' +
        '\t\t\t<Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" / >\n' +
        '<Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/logo.png" Addressable="true" />\n' +
        '\t\t</Assets>\n' +
        '\t</PackageManifest>'
        ,
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension=".json" ContentType=application/json"/><Default Extension=".vsixmanifest" ContentType="text/xml"/><Default Extension=".png" ContentType="image/png"/><Default Extension=".md" ContentType="text/markdown"/></Types>\n'
        ,
        "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAFatJREFUeF7tXXt0k1W2P3knbdo0aUvfbdJKW9qpMhcdRYvKG4ugI+AItFS9LBz13qtcQb3oLHHWKArq1btGZ8E4SksBBUSelWflSgdkIesKtfSBbZK+KWnSpGnzTu7aKcW0Ju358j2apDn/Zp999uOX852zzz77sNAEbL8vayiUy3irMqSCIlBfrbNUqrS28q9Lc6onmjlYE0XhpRUNs9Ml4HThfD6HleBNb6vDdV2tMx9v0dvK9xXnnJ4ItglpACzbcXVhukxYkh4tmMvnsmVEHGq1O7VtBstJda+tfM/KnEoifYOJNuQA8IedjY/JJbziFIlgFo/LklDhDJvdpW/XW6pUelvFlyuz91PBM1B4BD0AXC4Xq3jnteXyWP7KxCj+A1wOK5JO41rtzv5Og+2MWmvduat48hcsFstF53h08w5KAKzZ+gPPIhEXp0lFKxLFvEIOmyWk21De+DucLnOX0VbdqjPtEuiNFdueudM2HnKQGTNoADBvy+XI5HRRSUaMYHm8mD+dw0Y8MopT3dfhRLYbRut5da9ld0eLaceJ9Xf0Uz0GHfwCGgDzP62VJYk5qxSxkY/LIrh3c9mITYcRqOZpdyKn1mS/oNT07+k0OsqPr87XUj0GVfwCDgAPflybmBXHKZXHRSyTCrnTOOyAE5GQ7R1OF9KZ7ZdUmoG9TRpH2Znn87sIMaCZOCCsO+vTqxmKaF5pVqxgqUTELWCzmBHL6RpcvzE5nt5kr2nqsexTGmxlVavz1DT7d0z2zFjaixizt9VlZ8VySzNloseiBOxcppxgd7iQUmdGKq0ZKXUWt2QKqQDJZUKkkAoRl8OMSQB8fRZnfbPWtL+px152es2UxjG9RQMBM9reFLxoa11Behw4XfioWMDJYjH0T7fYnUilMyOl1uJ2vK99GxjDDQSZAMmlQiTgMrPkcLlcyGhxNDVrzQeadbbtJ1bn/USDr72yZAwAb1e11klF3FymFDPZHIMO15kh1u/XsBkwM0gHASHicfzi4U8nnclev2FW2hR/+hLtwwgA1h1WlmXFCVcRFY4ovdHiuPVPb9P753RfY6ZKBLdmBrGAfjA0aczl7y1SlBK1AVF62gGwYndDSWFGVDld073BbL/1T+8wWInq7xd9cjT/1swQLeT6xWOsTvBZqFb3rdq1PGfHWLRkfqcVAA/9/XJqUV58LZfNiiYj5Mi+OpP95iLOjK73jW/wLSGK5148wtpBKqIWDHany/D1le68qmentlNpP09etALgnarWCxIR93dUCN/Tb7u5eregG/3j63Rf+sRH8pBcJnADIjaSmkBlt9H2/Rtz06dTYUNvPGgDwLP7mzffniRaT0bwbqMVqbQWt+O1A3YyrBjvK4vg3poZJonJgeFKp2nL3x7LfJkOJWgBwOLPa+bOy4494U8Ur6vPipRa2KdbUK85uJzuy0ExIi6SS2ERKUSJUXzCfoRo4onGnnmHnio4SbjzGB0oB8CyPbX8exMlSiGPk4wrbLsetmsWt+P7LA7cbkFJFyXguIEAgEiRCLB1MNscHee69Iq9j+dTutKlHACvHVNVpkoED+Fopjfb0cFaLeq3hrbTfdkiks9Bj+TLkARzJ9GmN3/z1gKFO4+RqkYpAJ7e2/DSXanR7+EKd+SqFrVSvF/HHTtQ6NIkAvRwHn622vdthnVly3Lep0p+ygBQtK126vw86UU+h4W1F7rY2od+aDNSpUdQ87kzVYzuSovC0sHqcNmPX9XdVbkm/0esDkysASAt68Pqjjohl52DI1SLzoKO1gfsETmOCpTTLMyVoXQp3prAbHc2rJ2RQklYnZIZYO3h5u3ZcSKssCUczOy9ogn5xR5RhMDicNntcdgHUPU3Bj7/aHHW00THGUlPGgDLK+qLZ2RG78AN9Z681ot+1pjIyh2S/W+LE6G5k2OwdINQ8dlmQ8nu4twKrA4+iEgBYP7Wq0kL82PqeRy8UG9NZz+qVhnIyBvyfQvl0aggCS+x2eZwGY7W9uYefyav01/DkALAmyfV5yaJ+VhhSojqfVXT46+cE6rfkoJYNEmMFzDqNlrPvzE3415/DeQ3AJ77qundguQI7PDkviuagI3h+2s8uvrBmcLS2+Ow2dd09G/+ZMltr2B38CD0CwCPbq+dPWey9BRuqPesUo9+6hrwR74J2+c3iRFohgLvYhOEik9d08058GQ+4fuMhAGw8dtvuRJutkrIZafgeOeaxoROXevFIQ3TjLDAnMkxaHKcCMsuZruzXW9vlG+cOZPQAQphAPzpmOpIskSwEEcqSNaALZ/VEdS3p3BUpYWGz2G5t4a4SSctWsuRTQvli4gIQwgApV9eW3tPuvgD3AGO1GlRay+1qVm4Y4cKXVqMAD08BT9UfE5tXLvjickf4uqPDYCiz+sKFkyWXOJxWFiH2+FQL64LxqYjEiq2OVy2Y9f00yqfmlIzNmeEsAHw/tm2ugguByv82NJrQUfrwqFeHAfg0iycIkPpMXih4gG7o/6lGalYWcVYAPiPg03/mDIpAivsaIVQb40GGcwT84gX16FE6aKFHLSsIA7xMe8q1HUPfPY/j2T961jjjAmAJyrqVtyfKdmJG+qFFT+s/P1pkG0767YYlBLNdx+MRGOmXxssDgQHTO0GK6r6uRcxlR3sj45k+sCOAHYGOA1Cxd8161d+UTxl12j0owJg8a7mhLkZwgYuG6/SRk1XP6pWEg/1ZsYK0fPTk9D9mRIEK18yDXYc3zXr0cfnO1Fzj5kMq4DsW6iIRgWJeKFiu9OlP6k25xxakXndlzKjWvvNE+p/ToriY4UZu4029FWNhrDRpqWI0cZ56djfN9wBYB2y8UQLutQeejkHSwriEG6iaXef9dwb8zLuIwyA5w40bSpIiHgV1+DgfAABkXZ7UiR6e0EGgq0OHQ22oBuOqdGVzqCo1YBtAnA+gAC3/dhh3LR1yeQN3ui9zgCLPqudNT9Heho31AvTPkz/RNt7Dyvc3zRyk77vUSH8BGuSdUeUREULeHr4DMDnAKfZHC50slE3+/DT+VUj6X9l+40uF1tS3d4i5HJoDfXeJ49Gby3IGHabxulC6McOI/r4XCfhdDHYKz9/bxKamixGnjUl4BbRa8fU6J8heAxNLFTsaNcXpqRvZLGcniD4FQD+q1J5MF0qXIyDLAj17qvpQZDlQ7Q9Nz0Jrb47AXE8roiDk+DfOmAjzg/Gj+CxEcwqAK6h5nC50KcXrqNPzvt9ZE5UNcbo4fr60oJY7FCxWmc+9E6R4hGfAFj1ReML0zOisMOIEOyBxZY/bctCBZqX/cuWxmRzone+bUMHasnlDDyaH4tenZmKRLxf7vafaOxF64+G3mcA7A7BIQgS4bbz6r4Xy5/I/miIftgM8MF37TdEPDbW6uKHtj50sdX/FfZ/L1K49/xDDQJHG46p0Fk/tpGeys9QRKO3F8gRBE6GGsQG1h4OTQCAjnelidGdqXhZxSabU/Of96fEewXAR9XtGj6HHTsWmmB1DQc9ZBqTAIDdCVw5o6IFatAJDoxwdlMWm7PnxftTbv3Jh80AOACwOpwIsnv0JEO9TAKACsd74xFIQSeJkOPOIuJzRi9rQxoAVJ3y0QWA36aI0eYiOXaghApwBErQCefUMOQBAA6F7SUsjOiKL3gDTSAEncIAuOkZuJv/7D1J7jt3sDVkogVC0CkMACY8jRAK1KBTGAAMAQCGCcSgUxgADAIAhgq0oFMYAAwDINCCTmEAhAEwZp2BCbENZAoH4RmAhKXpCgSREIlw1zAACJvslw5hAJAwno+u4TUA9TYdlWN4BiBhcKpmAEgl/8Md8eg+eRSCit6eeQAkxKOt6+DbBYOnqXCo5m/yizcBJ9QMQGUqOW3eHoUxhI4vd/SjN0+1UJa+PmEAUPIvk9zpZDGYBRbHw8G4Y0KpvH8/0ETJTDAhAPDijGS0Ymo8djUtXEeMF53Z7kRbzrSjfX7cqRgpc8gDoGTaJPRv9yYhoZf7cVAlA66EQRZwILe4SB5KiuYPO6qmKmcxpAEA5dNen52GoPK2Z4Oc97MqA9r6fSeq7/bvTiKTgPGWsAJ3Kop3k380LGQB4OsGEaSlffBdO+lMYiYBsLQgDq1/MGXYLHamSY9eONRMWoyQBABs894tkiMAgWeDb+dfz3WiHZe6SRuOKQbegAy7gfJL3W4gk20hBwA4c//Lggx3+rhnehd877+4rEGbz7SRtRlj/X0BuWcAbi6p0Hl1H2lZQg4A3hZ98I+BPP/Xj6kp2TqRtjoGA6aAHFIA8LXog5u+r1SqgqoIxMsPpqIn7ohDnpdt6QByyADA16LvutGGNnyjInxxFONPShsJlH1d90Dqr5JT6QBySACgqccc0os+QFqvyY7+croVQeV0KlvQA+D142r3GzqhvOijc/cS9AA4rza4C0bQ/a2k8l/njRdTi76QCgXDosjlQsOKO4CCdHwr6QYAU4u+kAKAN6cEwnUromDxdV7BBJCD+hMw0tB0LZSIOpQIva+tK1NADhkAQNYMhHkhRBosLS8hwr17GVnOlUkghwQA6AiQ0A0iX4s+Olf83nQKKgDA0S7Uwh/ZGjUm9MLB5qCJ9MFNZNBlZlbMsAUsABlqKEGFMqZaUAFg5W/j0QuFyb/K7IFDkT/u/5kpm5EaB2IWT05LQIpY4a9qETCx6BuXXQBVJWIgqfP9hxUoUyYcpgckeCh1ZmT2s1QcKY9idmazWChFwncnp3grQsHUos9TXMZKxMCgVBSJAj6jpXhh+iLgyCAt7a3TrYy/j8hYkaghi5MtEzfEx1vQJOC8iiEQfPOvdg2gP59uYTw1jUiZuFEvhzJZKNLTpn+8JxGV3pnAWDkXDH8SIrlhtKEvL2vQzv/rZjxHgdJCkaD1q5XKgxkMlIodaeHcSSJUOi0B3Z0e5a4f7Fnvl5A3GCCGmsYGi939T4eVPhSkpvKGD64KREvFtujMhzaNVioWBmaqWDSukmE63xagpVg0DMdUufiwc/23AG3l4odEYuLBCP/Vn9g9aX8wYsi8TDwZM7Fd6Z/2jDwZA6Ix9WiUf2aYmL0YfTQKTMzks3ET06X4WjP+bNyQaOGHI/GdRBfluD0cOaRQ+OlYulyLx3dcn44FEcOPR+M5ig4qnGPeoXFpezwaBgg/H0+He0fnGTDPxw+J+adjqiPJEsFCHFPAq2J7r2gQvKwRbsQtAM/oQtJMNGYpnBad5cimIvkiIiMRflNh47ffciXcbJWQy6b1XUEiSoQqLbFQr7Ndb2+Ub5w5k1CJFMIAAGM/ur129pzJ0lO4L4ueVerRT10DoeonWvT6TWIEmqGQYPGG6/KnrunmHHgy/zRWBw8ivwAA/Z/76ud3C5IjX8YdEGri3egn9rYwLu9Qo4uP5LkfgMJtNR0Dmz9ZkvUKLr0nnd8AACZvnlSfmyTmT8cZuNtoRV/VkHsUEmecUKCBG8WTxHwsVbqN1vNvzM3AeuHdG0NSAJi/9WrSwvyYeh6HhfWKcU1nP+OpUlhWDCCiQnk0KhhRDseXeDaHy3C0tjf3+DN5fr+LSwoAINjyivriGZnRO1gebwCPZk+4Ev2zJvCreY0HJm6LEyG4XYTTXC4XOttsKNldnFuBQ++LhjQAgPHaw83bs+NEpTiCwK0f2Br2WRw45BOGJkrAcW/5IMsHp9XfGPj8o8VZT+PQjkZDCQBcLhfrw+qOOiGXnYMjUIvOgo7Wk3t6FmecYKJZmCtD6VIBlshmu7Nh7YyUXCziMYgoAQCMUbStdur8POlFPoc1vJKjDwGoeoGUCiOMNw8ioV6rw2U/flV3V+Wa/B+pkJsyAIAwpXsbXronNfo9XMGOXNWiVr1/z8/jjhHodGkSgfuBS9x2sc2w7rNlOe/j0o9FRykAYLDXjikrUyXCh8YaGH7Xm+3oYK0W9Vsn5nogks9xl8SRYIZ62/SWb95aIC/CsS0uDeUAWLanln9vokQp5HGScYVo11vcjygoteaQXxzCYk8hEyK5VIBSJHjffLCj2eboONelV+x9PN+Ka1ccOsoBAIMu/rxm7rzs2BO4oWJPQbv6rG4gACDgbn0oNHjXQC4TuB2fGIUX4PHUG0K9Jxp75h16quAk1fagBQAg5LP7mzffniRaT0bgbqMNqbRm92VR7UBwgQGujSukQrfjcaN6vmx1pdO05W+PZWKH3YnYnDYAgBDvVLVekIi4vyMikC/ann6bGwgqrSVgzxQghu/+p0uFKDaSR4XaqNto+/6NuelY4XZ/BqQVAA/9/XJqUV58LZeNFyrGVQAehRiaGa73je8BU0IU7+Y/Xei+0kZlsztdhq+vdOdVPTuVfClxH4LRCgAYc8XuhpLCjKhy3FAxUQNC0olSC4tIM2NVRaDyt1wqRAqZADtZg6heEOqtVvet2rU8ZwfRvkToaQcACLPusLIsK064iohg/tAaLQ43EAAQbRTHF+BJOnA4OF4s4PgjHqE+TRpz+XuLFFjhdUKMRxAzAgAY8+2q1jqpiEtJ+BJHYZPNcWtmUOv8CzZlSAcdDo4X8eh3+pBeOpO9fsOstCk4epKlYQwAIGjR1rqCjHjuk1lxokciuOwsuj4LI40y+Fjj4MwAawdfGYpgDLls0OHgeNyDGbJOgOneaHE0NWvNB1o09rLKZ6bUkOWJ259RAHgKVbStLjs1lluaKRM9FiVg50LdHSaa/WYNosFF5ODMoIB/OjheKkRcDjNyOF0u1Gdx1jdrTfubeuxlp9dMIf9qlB8GZEbbMQSb9enVDEU0rzQrVrBUIuIWMAUGcAI0JsfTm+w1TT2WfUqDraxqdR5zNeTGaxdAFJQPflybmBXHKZXHRSyTCrnT/IkmEh2TTnqI4unM9ksqzcDeJo2j7Mzz+V10jkeUd0DMAL6Env9prSxJzFmliI18XBbBvZvLRnjZEkStQDG93Ymc2gH7BWVP/55Oo6P8+Or8gE1+CGgAePpl3pbLkcnpopKMGMHyeDF/OoeNqAm1UeR8hxPZbhit59W9lt0dLaYdJ9bf0U8Ra1rZBA0APK2wZusPPItEXJwmFa1IFPMKOWzW8GqTtJrsF+YOp8vcZbRVt+pMuwR6Y8W2Z+4c37CkH3oHJQA89YR0tNKd15anxfJXJkbxH+ByWMNfmPTDKKN1sTtc/V191v9V9Vh3VqycvJvFYgX1vbegB8BIZxXvalySEsMrTpMIZnLYLLyrNWOAxGZ36dv1liqV3lbx5crs/RRjalzZhRwAPK25sqLu4RSpoCRVIpjD47Dx864QQla7U9tisJxs0Zp37C3JOzquXqJx8JAGgKfdllY0zE6X8FZlSIXz+RxWgjebWh2u62qd+XiL3la+rziH8D07Gv1EG+sJAwBPC/6+rKFQLgMwCNz5dWqdpVKltZV/XZpTTZulA5Tx/wORRBw1+O9h2gAAAABJRU5ErkJggg=="
    ];

    const files = [
        {
            path: 'extension.vsixmanifest',
            contents: Buffer.from(array[0], 'utf8')
        },
        {
            path: '[Content_Types].xml',
            contents: Buffer.from(array[1], 'utf8')
        },
        {
            path: 'extension/logo.png',
            contents: image ? Buffer.from(image.replace(/data:.*?;base64,/g, ''), "base64") : Buffer.from(array[2], "base64")
        },
        {
            path: 'extension/README.md',
            contents: Buffer.from("", "utf8")
        },
        {
            path: 'extension/package.json',
            contents: Buffer.from(JSON.stringify(packageJson), "utf8")
        }
    ];
    return writeVsix(files, path);
}