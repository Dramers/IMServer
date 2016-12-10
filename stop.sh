ps -ef|grep 'DB'|grep -v grep |awk '{print $2}'|xargs kill -9

ps -ef|grep 'frontServer'|grep -v grep |awk '{print $2}'|xargs kill -9

ps -ef|grep 'node'|grep -v grep |awk '{print $2}'|xargs kill -9