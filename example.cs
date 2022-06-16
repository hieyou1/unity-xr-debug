using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class DebugServer : MonoBehaviour {
    private const string DEBUG_URL = "https://<something.ngrok.io>/debug";
    private const string DEBUG_KEY = "<randomly-generated-debug-key-here>";

    IEnumerator _DebugLog(string logText) {
        WWWForm form = new WWWForm();

        form.AddField("dbgkey", DEBUG_KEY);
        form.AddField("log", logText);

        using (UnityWebRequest www = UnityWebRequest.Post(DEBUG_URL, form)) {
            yield return www.SendWebRequest();
        }
    }

    void DebugLog(string logText) {
        StartCoroutine(_DebugLog(logText));
    }

    void Start() {
        DebugLog("lol");
    }
}