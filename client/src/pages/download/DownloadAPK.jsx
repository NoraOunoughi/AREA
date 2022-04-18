import "./download.css";
import resume from '../../apk_volume/app-release.apk';

export default function Download() {

  return (
    <div className="download">
        <a class='button' href={resume} download="areaPotter.apk">Download APK</a>
    </div>
  );
}